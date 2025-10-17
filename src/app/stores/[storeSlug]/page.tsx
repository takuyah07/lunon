/**
 * /stores/[storeSlug] - 店舗ページ
 * 在籍推し一覧 + 今月のランキング表示
 * 
 * パフォーマンス最適化:
 * - ISR: 5分毎に再検証
 * - 静的生成: ビルド時に全店舗ページを生成
 */

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import OshiCard from "@/components/OshiCard";
import RankingList from "@/components/RankingList";

// ISR: 5分毎に再検証
export const revalidate = 300;

interface StorePageProps {
  params: {
    storeSlug: string;
  };
}

interface OshiData {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
  profileShort: string | null;
}

async function getStoreData(slug: string) {
  const store = await prisma.store.findUnique({
    where: { slug, isPublic: true },
    include: {
      oshis: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return store;
}

async function getRankingData(storeId: string) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(
      `${siteUrl}/api/stores/${storeId}/ranking`,
      { next: { revalidate: 300 } } // 5分キャッシュ
    );

    if (!response.ok) {
      return { month: "", items: [] };
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch ranking:", error);
    return { month: "", items: [] };
  }
}

// 静的パス生成: 全店舗ページをビルド時に生成
export async function generateStaticParams() {
  const stores = await prisma.store.findMany({
    where: { isPublic: true },
    select: { slug: true },
  });

  return stores.map((store: { slug: string }) => ({
    storeSlug: store.slug,
  }));
}

export default async function StorePage({ params }: StorePageProps) {
  const { storeSlug } = await params;
  const store = await getStoreData(storeSlug);

  if (!store) {
    notFound();
  }

  const ranking = await getRankingData(store.id);

  return (
    <div className="min-h-screen bg-rose-50">
      {/* ヘッダー */}
      <header className="relative overflow-hidden border-b border-rose-200 bg-rose-100 shadow-lg">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyb3NlIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-rose-900 sm:text-5xl lg:text-6xl">
              {store.name}
            </h1>
            {store.description && (
              <p className="mt-4 text-lg text-rose-800">
                {store.description}
              </p>
            )}
            {(store.addressText || store.hoursText) && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-rose-700">
                {store.addressText && (
                  <div className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 backdrop-blur-sm">
                    <span>📍</span>
                    <span>{store.addressText}</span>
                  </div>
                )}
                {store.hoursText && (
                  <div className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 backdrop-blur-sm">
                    <span>🕐</span>
                    <span>{store.hoursText}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* 在籍推し一覧 */}
          <section>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-rose-700">
                在籍推し一覧
              </h2>
              <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-rose-300" />
            </div>
            {store.oshis.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-12 text-center backdrop-blur-sm">
                <p className="text-gray-500">在籍中の推しがいません</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {store.oshis.map((oshi: OshiData) => (
                  <OshiCard
                    key={oshi.id}
                    slug={oshi.slug}
                    name={oshi.name}
                    photoUrl={oshi.photoUrl}
                    profileShort={oshi.profileShort}
                    showProfile={false}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 今月のランキング */}
          <section>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-rose-700">
                今月のランキング
              </h2>
              <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-rose-300" />
            </div>
            <RankingList month={ranking.month} items={ranking.items} />
          </section>
        </div>
      </main>

      {/* フッター */}
      <footer className="mt-20 border-t border-white/20 bg-gradient-to-r from-gray-900 to-gray-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <a 
              href="/legal/terms" 
              className="text-gray-300 transition-colors hover:text-white"
            >
              利用規約
            </a>
            <a 
              href="/legal/privacy" 
              className="text-gray-300 transition-colors hover:text-white"
            >
              プライバシーポリシー
            </a>
            <a 
              href="/legal/tokushoho" 
              className="text-gray-300 transition-colors hover:text-white"
            >
              特定商取引法に基づく表記
            </a>
          </div>
          <div className="mt-6 text-center text-xs text-gray-400">
            © 2025 {store.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
