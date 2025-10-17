/**
 * /oshis/[oshiSlug] - 推し詳細ページ
 * 写真・プロフィール + ギフトプリセットボタン
 * 
 * パフォーマンス最適化:
 * - ISR: 5分毎に再検証
 * - 静的生成: ビルド時に全推しページを生成
 */

import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import GiftButton from "@/components/GiftButton";

// ISR: 5分毎に再検証
export const revalidate = 300;

interface OshiPageProps {
  params: {
    oshiSlug: string;
  };
}

interface PresetData {
  id: string;
  label: string;
  amount: number;
}

async function getOshiData(slug: string) {
  const oshi = await prisma.oshi.findUnique({
    where: { slug, isActive: true },
    include: {
      store: true,
      presets: {
        where: { isActive: true },
        orderBy: { amount: "asc" },
      },
    },
  });

  return oshi;
}

// 静的パス生成: 全推しページをビルド時に生成
export async function generateStaticParams() {
  const oshis = await prisma.oshi.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return oshis.map((oshi: { slug: string }) => ({
    oshiSlug: oshi.slug,
  }));
}

export default async function OshiPage({ params }: OshiPageProps) {
  const { oshiSlug } = await params;
  const oshi = await getOshiData(oshiSlug);

  if (!oshi) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-rose-50">
      {/* ヘッダー */}
      <header className="border-b border-rose-200 bg-rose-100 shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <a
            href={`/stores/${oshi.store.slug}`}
            className="text-sm text-rose-700 hover:text-rose-900 font-medium"
          >
            ← {oshi.store.name} に戻る
          </a>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* 推し情報 */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* 写真 (1:1) */}
              <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg bg-gray-100 shadow-md sm:w-64">
                {oshi.photoUrl ? (
                  <Image
                    src={oshi.photoUrl}
                    alt={oshi.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 100vw, 256px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-rose-200">
                    <span className="text-6xl font-bold text-gray-400">
                      {oshi.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* プロフィール */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">
                  {oshi.name}
                </h1>
                {oshi.profileShort && (
                  <p className="mt-4 whitespace-pre-wrap text-gray-600">
                    {oshi.profileShort}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ギフト送信エリア */}
          <div className="border-t border-rose-200 bg-rose-50 p-6 sm:p-8">
            <h2 className="mb-4 text-center text-xl font-bold text-rose-800">
              ギフトを送る
            </h2>
            
            {oshi.presets.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-500">
                  現在、ギフトプリセットが設定されていません
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {oshi.presets.map((preset: PresetData) => (
                  <GiftButton
                    key={preset.id}
                    oshiId={oshi.id}
                    presetId={preset.id}
                    label={preset.label}
                    amount={preset.amount}
                  />
                ))}
              </div>
            )}

            <p className="mt-6 text-center text-xs text-rose-600">
              ※Square決済画面に遷移します
              <br />
              ※決済反映まで最大5分かかる場合があります
            </p>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="mt-16 border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <a href="/legal/terms" className="hover:text-gray-900">
              利用規約
            </a>
            <a href="/legal/privacy" className="hover:text-gray-900">
              プライバシーポリシー
            </a>
            <a href="/legal/tokushoho" className="hover:text-gray-900">
              特定商取引法に基づく表記
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
