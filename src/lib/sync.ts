/**
 * Square決済同期＆月次集計処理
 * 
 * NOTE: 
 * - Webhook連動・返金処理はPhase2以降
 * - エラーはログ出力のみ（MVPではスキップ）
 */

import { prisma } from "./db";
import { listPayments, getOrder, squareClient } from "./square";
import { getMonthRangeJst, formatMonthYmJst } from "./time";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Square決済データを同期してDBに保存
 * @param lastSyncTime - 前回同期時刻（省略時は24時間前）
 * @returns 同期した決済件数
 */
export async function syncPaymentsFromSquare(
  lastSyncTime?: Date
): Promise<number> {
  const beginTime = lastSyncTime
    ? lastSyncTime.toISOString()
    : dayjs().subtract(24, "hour").toISOString();

  console.log(`[Sync] Fetching payments from ${beginTime}`);

  // Square APIから決済一覧取得
  const payments = await listPayments(beginTime);
  
  if (payments.length === 0) {
    console.log("[Sync] No new payments found");
    return 0;
  }

  console.log(`[Sync] Found ${payments.length} payments`);

  let syncedCount = 0;

  for (const payment of payments) {
    try {
      // 既に登録済みならスキップ
      const existing = await prisma.payment.findUnique({
        where: { squarePaymentId: payment.id },
      });

      if (existing) {
        console.log(`[Sync] Payment ${payment.id} already exists, skipping`);
        continue;
      }

      // Order詳細からCatalogItemを取得
      const order = payment.lineItems.length > 0 
        ? await getOrderWithLineItems(payment.id)
        : null;

      if (!order || !order.lineItems || order.lineItems.length === 0) {
        console.warn(`[Sync] No line items found for payment ${payment.id}, skipping`);
        continue;
      }

      // 最初のLineItemからCatalogItemを取得
      const firstLineItem = order.lineItems[0];
      const catalogItemId = firstLineItem.catalogObjectId;

      if (!catalogItemId) {
        console.warn(`[Sync] No catalog item ID for payment ${payment.id}, skipping`);
        continue;
      }

      // Catalog Item IDからGiftPresetを検索
      const preset = await prisma.giftPreset.findFirst({
        where: { squareCatalogItemId: catalogItemId },
        include: { oshi: true },
      });

      if (!preset) {
        console.warn(`[Sync] No preset found for catalog item ${catalogItemId}, skipping`);
        continue;
      }

      // JST時刻に変換
      const paidAtJst = dayjs(payment.createdAt).tz("Asia/Tokyo").toDate();
      const amountInYen = Number(payment.amount);

      // Paymentレコード作成
      await prisma.payment.create({
        data: {
          squarePaymentId: payment.id,
          oshiId: preset.oshiId,
          storeId: preset.oshi.storeId,
          amount: amountInYen,
          paidAtJst,
        },
      });

      console.log(`[Sync] Payment ${payment.id} synced successfully`);
      syncedCount++;
    } catch (error) {
      console.error(`[Sync] Failed to sync payment ${payment.id}:`, error);
      // MVPではスキップして次へ
      continue;
    }
  }

  console.log(`[Sync] Total synced: ${syncedCount} payments`);
  return syncedCount;
}

/**
 * Order詳細（LineItems含む）を取得
 */
async function getOrderWithLineItems(paymentId: string) {
  try {
    const { result } = await squareClient.paymentsApi.getPayment(paymentId);
    const orderId = result.payment?.orderId;
    
    if (!orderId) return null;

    const order = await getOrder(orderId);
    return order;
  } catch (error) {
    console.error("Failed to get order details:", error);
    return null;
  }
}

/**
 * 月次ランキングキャッシュを更新（当月のみ）
 * @returns 更新した店舗数
 */
export async function updateMonthlyRankingCache(): Promise<number> {
  const { start, end, monthYm } = getMonthRangeJst();

  console.log(`[Ranking] Updating cache for ${monthYm}`);

  // 当月の全決済を店舗×推し別に集計
  const aggregations = await prisma.payment.groupBy({
    by: ["storeId", "oshiId"],
    where: {
      paidAtJst: {
        gte: start,
        lt: end,
      },
    },
    _sum: {
      amount: true,
    },
  });

  console.log(`[Ranking] Found ${aggregations.length} aggregations`);

  // キャッシュテーブルにUPSERT
  for (const agg of aggregations) {
    const totalAmount = agg._sum.amount || 0;

    await prisma.monthlyRankCache.upsert({
      where: {
        storeId_oshiId_monthYm: {
          storeId: agg.storeId,
          oshiId: agg.oshiId,
          monthYm,
        },
      },
      create: {
        storeId: agg.storeId,
        oshiId: agg.oshiId,
        monthYm,
        totalAmount,
        refreshedAt: new Date(),
      },
      update: {
        totalAmount,
        refreshedAt: new Date(),
      },
    });
  }

  // 更新された店舗の一覧を取得
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatedStores = new Set(aggregations.map((a: any) => a.storeId));

  console.log(`[Ranking] Updated ${updatedStores.size} stores`);
  return updatedStores.size;
}

/**
 * 同期＆集計の実行（APIルートから呼ばれる）
 */
export async function runSyncAndAggregation() {
  console.log("[Sync] Starting sync and aggregation");

  // 前回の同期時刻を取得（最新のPaymentのcreatedAt）
  const lastPayment = await prisma.payment.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const lastSyncTime = lastPayment?.createdAt;

  // 1. Square決済同期
  const syncedCount = await syncPaymentsFromSquare(lastSyncTime);

  // 2. 月次集計更新
  const updatedStores = await updateMonthlyRankingCache();

  console.log("[Sync] Completed");

  return {
    syncedPayments: syncedCount,
    updatedStores,
    lastSyncTime: new Date().toISOString(),
  };
}
