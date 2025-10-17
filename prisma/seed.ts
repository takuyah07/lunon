/**
 * Prisma Seed Script
 * テストデータを作成します
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
    await prisma.giftPreset.deleteMany();
    await prisma.oshi.deleteMany();
    await prisma.store.deleteMany();
  }

  // 店舗作成
  console.log("Creating store...");
  const store = await prisma.store.create({
    data: {
      name: "サンプル店舗",
      slug: "sample-store",
      description: "推しにギフトを送れるテスト店舗です",
      addressText: "東京都渋谷区サンプル1-2-3",
      hoursText: "平日 18:00-24:00 / 土日祝 17:00-24:00",
      isPublic: true,
    },
  });

  console.log(`✓ Store created: ${store.name}`);

  // 推し作成
  console.log("Creating oshis...");
  const oshis = [];

  const oshi1 = await prisma.oshi.create({
    data: {
      storeId: store.id,
      name: "花子",
      slug: "hanako",
      profileShort: "明るく元気な性格です！いつも笑顔でお客様をお迎えします。",
      photoUrl: null,
      isActive: true,
    },
  });
  oshis.push(oshi1);

  const oshi2 = await prisma.oshi.create({
    data: {
      storeId: store.id,
      name: "麻美",
      slug: "asami",
      profileShort: "落ち着いた雰囲気の癒し系です。ゆったりとした時間を過ごせます。",
      photoUrl: null,
      isActive: true,
    },
  });
  oshis.push(oshi2);

  const oshi3 = await prisma.oshi.create({
    data: {
      storeId: store.id,
      name: "さくら",
      slug: "sakura",
      profileShort: "明るくて話しやすい！いつもニコニコしています♪",
      photoUrl: null,
      isActive: true,
    },
  });
  oshis.push(oshi3);

  console.log(`✓ Created ${oshis.length} oshis`);

  // ギフトプリセット作成
  console.log("Creating gift presets...");
  let presetCount = 0;

  for (const oshi of oshis) {
    // 各推しに3つのプリセット（¥1,000 / ¥3,000 / ¥5,000）
    await prisma.giftPreset.createMany({
      data: [
        {
          oshiId: oshi.id,
          label: "ちょっとしたギフト",
          amount: 1000,
          squareCatalogItemId: `DUMMY_ITEM_${oshi.id}_1000`,
          isActive: true,
        },
        {
          oshiId: oshi.id,
          label: "応援ギフト",
          amount: 3000,
          squareCatalogItemId: `DUMMY_ITEM_${oshi.id}_3000`,
          isActive: true,
        },
        {
          oshiId: oshi.id,
          label: "スペシャルギフト",
          amount: 5000,
          squareCatalogItemId: `DUMMY_ITEM_${oshi.id}_5000`,
          isActive: true,
        },
      ],
    });
    presetCount += 3;
  }

  console.log(`✓ Created ${presetCount} gift presets`);

  // サンプル決済データ作成（任意）
  console.log("Creating sample payments...");
  const now = new Date();
  const payments = [];

  // 各推しに数件の決済データを作成
  for (let i = 0; i < 5; i++) {
    for (const oshi of oshis) {
      const amounts = [1000, 3000, 5000];
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
      
      const payment = await prisma.payment.create({
        data: {
          squarePaymentId: `DUMMY_PAYMENT_${oshi.id}_${i}_${Date.now()}`,
          oshiId: oshi.id,
          storeId: store.id,
          amount: randomAmount,
          paidAtJst: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // 過去7日間のランダムな時刻
        },
      });
      payments.push(payment);
    }
  }

  console.log(`✓ Created ${payments.length} sample payments`);

  // 月次ランキングキャッシュ作成
  console.log("Creating monthly rank cache...");
  const monthYm = formatMonthYmJst();

  // 各推しの合計金額を計算
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

  console.log(`✓ Created monthly rank cache for ${aggregations.length} oshis`);

  console.log("✅ Seed completed!");
  console.log("\n📝 Summary:");
  console.log(`  - Store: ${store.name} (/${store.slug})`);
  console.log(`  - Oshis: ${oshis.length}`);
  oshis.forEach((oshi) => {
    console.log(`    - ${oshi.name} (/${oshi.slug})`);
  });
  console.log(`  - Gift Presets: ${presetCount}`);
  console.log(`  - Sample Payments: ${payments.length}`);
  console.log("\n🚀 Access: http://localhost:3000/stores/${store.slug}");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
