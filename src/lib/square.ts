/**
 * Square API統合ライブラリ
 * - Checkout URL生成
 * - Payment一覧取得
 * 
 * NOTE: Webhook連動・返金処理はPhase2以降
 */

import { Client } from "square";

// DRY RUNモード（テスト用）
// SQUARE_DRY_RUN=true または Square環境変数が未設定の場合に有効
export const IS_DRY_RUN = 
  process.env.SQUARE_DRY_RUN === "true" ||
  !process.env.SQUARE_ACCESS_TOKEN ||
  !process.env.SQUARE_LOCATION_ID ||
  !process.env.SQUARE_APPLICATION_ID;

const SQUARE_ENV = process.env.SQUARE_ENV === "production" 
  ? "production" 
  : "sandbox";

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || "dummy_token";
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID || "dummy_location";
const SQUARE_APPLICATION_ID = process.env.SQUARE_APPLICATION_ID || "dummy_app_id";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// DRY RUNモードの場合は警告を表示
if (IS_DRY_RUN) {
  console.warn("[Square] DRY RUN mode enabled - Square API calls will be skipped");
}

/**
 * Squareクライアントのシングルトンインスタンス
 * DRY RUNモードの場合はnull
 */
export const squareClient = IS_DRY_RUN 
  ? null 
  : new Client({
      accessToken: SQUARE_ACCESS_TOKEN,
      environment: SQUARE_ENV as "production" | "sandbox",
    });

/**
 * Checkout URL生成
 * @param catalogItemId - Square Catalog Item ID
 * @param quantity - 数量（通常は1）
 * @returns Checkout URL
 */
export async function createCheckoutUrl(
  catalogItemId: string,
  quantity: number = 1
): Promise<string> {
  if (IS_DRY_RUN) {
    console.log("[DRY RUN] Checkout URL generation skipped");
    // DRY RUNモードでは店舗ページにリダイレクト（テストモード表示付き）
    return `${SITE_URL}/stores/sample-store?test=true`;
  }

  if (!squareClient) {
    throw new Error("Square client not initialized");
  }

  try {
    const { result } = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: `${catalogItemId}-${Date.now()}`,
      quickPay: {
        name: "ギフト",
        priceMoney: {
          amount: BigInt(0), // Catalog価格を使用
          currency: "JPY",
        },
        locationId: SQUARE_LOCATION_ID,
      },
      checkoutOptions: {
        redirectUrl: `${SITE_URL}/stores`,
        // askForShippingAddress: false, // 配送不要
      },
      prePopulatedData: {
        buyerEmail: undefined, // ゲストチェックアウト
      },
      order: {
        locationId: SQUARE_LOCATION_ID,
        lineItems: [
          {
            catalogObjectId: catalogItemId,
            quantity: quantity.toString(),
          },
        ],
      },
    });

    if (!result.paymentLink?.url) {
      throw new Error("Checkout URL generation failed");
    }

    return result.paymentLink.url;
  } catch (error: unknown) {
    console.error("Checkout creation error:", error);
    throw new Error("Failed to create checkout URL");
  }
}

/**
 * Payment一覧取得（指定期間）
 * @param beginTime - 開始時刻（ISO 8601）
 * @param endTime - 終了時刻（ISO 8601、省略可）
 * @returns Payment配列
 */
export async function listPayments(
  beginTime: string,
  endTime?: string
): Promise<Array<{
  id: string;
  amount: bigint;
  createdAt: string;
  lineItems: Array<{
    catalogObjectId?: string;
    quantity: string;
  }>;
}>> {
  if (IS_DRY_RUN) {
    console.log("[DRY RUN] ListPayments skipped");
    return [];
  }

  if (!squareClient) {
    console.error("Square client not initialized");
    return [];
  }

  try {
    const { result } = await squareClient.paymentsApi.listPayments(
      beginTime,
      endTime,
      undefined, // sortOrder
      undefined, // cursor
      SQUARE_LOCATION_ID
    );

    if (!result.payments) {
      return [];
    }

    return (
      result.payments
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((p: any) => p.status === "COMPLETED") // 成功した決済のみ
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((payment: any) => ({
        id: payment.id!,
        amount: payment.amountMoney?.amount || BigInt(0),
        createdAt: payment.createdAt!,
          lineItems: payment.orderId 
            ? [] // 注文詳細は別途取得が必要（簡易版ではスキップ）
            : [],
        }))
    );
  } catch (error: unknown) {
    console.error("ListPayments error:", error);
    // エラー時は空配列を返す（MVPではスキップ）
    return [];
  }
}

/**
 * Order詳細取得（LineItem情報取得用）
 * @param orderId - Square Order ID
 * @returns Order情報
 */
export async function getOrder(orderId: string) {
  if (IS_DRY_RUN) {
    console.log("[DRY RUN] GetOrder skipped");
    return null;
  }

  if (!squareClient) {
    console.error("Square client not initialized");
    return null;
  }

  try {
    const { result } = await squareClient.ordersApi.retrieveOrder(orderId);
    return result.order || null;
  } catch (error: unknown) {
    console.error("GetOrder error:", error);
    return null;
  }
}
