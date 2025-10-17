/**
 * Prisma Seed Script
 * テストデータを作成します（店舗共通テンプレート対応版）
 * 
 * 実行方法:
 * npx tsx prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";
import { formatMonthYmJst } from "../src/lib/time";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 既存データをクリア（開発環境のみ）
  if (process.env.NODE_ENV !== "production") {
    console.log("Cleaning existing data...");
    await prisma.monthlyRankCache.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.storeGiftTemplate.deleteMany();  // 新テーブル
    await prisma.giftPreset.deleteMany();
    await prisma.oshi.deleteMany();
    await prisma.store.deleteMany();
  }

  // ============================================
  // 店舗1: サンプル店舗（ピンク/パープルテーマ）
  // ============================================
  console.log("Creating store 1: サンプル店舗...");
  const store1 = await prisma.store.create({
    data: {
      name: "サンプル店舗",
      slug: "sample-store",
      description: "推しにギフトを送れるテスト店舗です",
      addressText: "東京都渋谷区サンプル1-2-3",
      hoursText: "平日 18:00-24:00 / 土日祝 17:00-24:00",
      isPublic: true,
      themePrimary: "#ec4899",
      themeSecondary: "#a855f7",
      themeAccent: "#f43f5e",
    },
  });

  // 店舗1: 共通ギフトテンプレート作成
  await prisma.storeGiftTemplate.createMany({
    data: [
      {
        storeId: store1.id,
        label: "ちょっとしたギフト",
        amount: 1000,
        squareCatalogItemId: `DUMMY_ITEM_${store1.id}_1000`,
        displayOrder: 1,
        isActive: true,
      },
      {
        storeId: store1.id,
        label: "応援ギフト",
        amount: 3000,
        squareCatalogItemId: `DUMMY_ITEM_${store1.id}_3000`,
        displayOrder: 2,
        isActive: true,
      },
      {
        storeId: store1.id,
        label: "スペシャルギフト",
        amount: 5000,
        squareCatalogItemId: `DUMMY_ITEM_${store1.id}_5000`,
        displayOrder: 3,
        isActive: true,
      },
    ],
  });

  // 推し作成（店舗1）
  const oshi1_1 = await prisma.oshi.create({
    data: {
      storeId: store1.id,
      name: "花子",
      slug: "hanako",
      profileShort: "明るく元気な性格です！いつも笑顔でお客様をお迎えします。",
      photoUrl: null,
      isActive: true,
    },
  });

  const oshi1_2 = await prisma.oshi.create({
    data: {
      storeId: store1.id,
      name: "麻美",
      slug: "asami",
      profileShort: "落ち着いた雰囲気の癒し系です。ゆったりとした時間を過ごせます。",
      photoUrl: null,
      isActive: true,
    },
  });

  const oshi1_3 = await prisma.oshi.create({
    data: {
      storeId: store1.id,
      name: "さくら",
      slug: "sakura",
      profileShort: "明るくて話しやすい！いつもニコニコしています♪",
      photoUrl: null,
      isActive: true,
    },
  });

  console.log(`✓ Store 1 created: ${store1.name} (3 oshis, 3 shared templates)`);

  // ============================================
  // 店舗2: Premium Lounge（ゴールド/ブルーテーマ）
  // ============================================
  console.log("Creating store 2: Premium Lounge...");
  const store2 = await prisma.store.create({
    data: {
      name: "Premium Lounge",
      slug: "premium-lounge",
      description: "上質な空間で特別なひとときを",
      addressText: "東京都港区プレミアム2-3-4",
      hoursText: "全日 19:00-翌3:00",
      isPublic: true,
      themePrimary: "#fbbf24",
      themeSecondary: "#1e40af",
      themeAccent: "#f59e0b",
    },
  });

  // 店舗2: 共通ギフトテンプレート作成（異なる価格帯）
  await prisma.storeGiftTemplate.createMany({
    data: [
      {
        storeId: store2.id,
        label: "プチギフト",
        amount: 2000,
        squareCatalogItemId: `DUMMY_ITEM_${store2.id}_2000`,
        displayOrder: 1,
        isActive: true,
      },
      {
        storeId: store2.id,
        label: "プレミアムギフト",
        amount: 5000,
        squareCatalogItemId: `DUMMY_ITEM_${store2.id}_5000`,
        displayOrder: 2,
        isActive: true,
      },
      {
        storeId: store2.id,
        label: "VIPギフト",
        amount: 10000,
        squareCatalogItemId: `DUMMY_ITEM_${store2.id}_10000`,
        displayOrder: 3,
        isActive: true,
      },
    ],
  });

  // 推し作成（店舗2）
  const oshi2_1 = await prisma.oshi.create({
    data: {
      storeId: store2.id,
      name: "エレナ",
      slug: "elena",
      profileShort: "エレガントで大人な雰囲気。上質な会話を楽しめます。",
      photoUrl: null,
      isActive: true,
    },
  });

  const oshi2_2 = await prisma.oshi.create({
    data: {
      storeId: store2.id,
      name: "美咲",
      slug: "misaki",
      profileShort: "知的で洗練された印象。特別な時間をお約束します。",
      photoUrl: null,
      isActive: true,
    },
  });

  console.log(`✓ Store 2 created: ${store2.name} (2 oshis, 3 shared templates)`);

  // ============================================
  // サンプル決済データ作成
  // ============================================
  console.log("Creating sample payments...");
  const now = new Date();
  let paymentCount = 0;

  const allOshis = [
    { oshi: oshi1_1, storeId: store1.id, amounts: [1000, 3000, 5000] },
    { oshi: oshi1_2, storeId: store1.id, amounts: [1000, 3000, 5000] },
    { oshi: oshi1_3, storeId: store1.id, amounts: [1000, 3000, 5000] },
    { oshi: oshi2_1, storeId: store2.id, amounts: [2000, 5000, 10000] },
    { oshi: oshi2_2, storeId: store2.id, amounts: [2000, 5000, 10000] },
  ];

  for (const { oshi, storeId, amounts } of allOshis) {
    const count = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < count; i++) {
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
      
      await prisma.payment.create({
        data: {
          squarePaymentId: `DUMMY_PAYMENT_${oshi.id}_${i}_${Date.now()}_${Math.random()}`,
          oshiId: oshi.id,
          storeId: storeId,
          amount: randomAmount,
          paidAtJst: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
      });
      paymentCount++;
    }
  }

  console.log(`✓ Created ${paymentCount} sample payments`);

  // ============================================
  // 月次ランキングキャッシュ作成
  // ============================================
  console.log("Creating monthly rank cache...");
  const monthYm = formatMonthYmJst();

  for (const store of [store1, store2]) {
    const aggregations = await prisma.payment.groupBy({
      by: ["oshiId"],
      where: {
        storeId: store.id,
      },
      _sum: {
        amount: true,
      },
    });

    for (const agg of aggregations) {
      await prisma.monthlyRankCache.create({
        data: {
          storeId: store.id,
          oshiId: agg.oshiId,
          monthYm,
          totalAmount: agg._sum.amount || 0,
          refreshedAt: new Date(),
        },
      });
    }
  }

  console.log(`✓ Created monthly rank cache`);

  console.log("\n✅ Seed completed!");
  console.log("\n📝 Summary:");
  console.log(`  📍 Store 1: ${store1.name}`);
  console.log(`     - Slug: /${store1.slug}`);
  console.log(`     - Theme: Pink/Purple`);
  console.log(`     - Oshis: 花子, 麻美, さくら`);
  console.log(`     - Shared Templates: ¥1,000 / ¥3,000 / ¥5,000`);
  console.log(`\n  📍 Store 2: ${store2.name}`);
  console.log(`     - Slug: /${store2.slug}`);
  console.log(`     - Theme: Gold/Blue`);
  console.log(`     - Oshis: エレナ, 美咲`);
  console.log(`     - Shared Templates: ¥2,000 / ¥5,000 / ¥10,000`);
  console.log(`\n🚀 Access:`);
  console.log(`   - http://localhost:3000/stores/${store1.slug}`);
  console.log(`   - http://localhost:3000/stores/${store2.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
