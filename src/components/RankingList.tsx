/**
 * RankingList - ランキング表示コンポーネント
 * TOP3は大きく表示、それ以降はリスト形式
 */

import Image from "next/image";
import Link from "next/link";

interface RankingItem {
  rank: number;
  oshiId: string;
  name: string;
  slug: string;
  totalAmount: number;
  photoUrl?: string | null;
}

interface RankingListProps {
  month: string;
  items: RankingItem[];
}

export default function RankingList({ month, items }: RankingListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-12 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 text-6xl">🏆</div>
        <p className="text-lg text-gray-600">まだランキングデータがありません</p>
        <p className="mt-2 text-sm text-gray-400">
          ギフトを送ってランキングに参加しよう！
        </p>
      </div>
    );
  }

  const top3 = items.slice(0, 3);
  const others = items.slice(3);

  return (
    <div className="space-y-6">

      {/* TOP3カード */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {top3.map((item) => (
            <Link key={item.oshiId} href={`/oshis/${item.slug}`}>
              <div className="group cursor-pointer overflow-hidden rounded-2xl border-2 border-rose-300 bg-rose-50 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                {/* ランク表示 */}
                <div className="relative">
                  <div className="absolute left-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-rose-400 text-xl font-extrabold text-white shadow-lg ring-4 ring-white">
                    {item.rank === 1 && "🥇"}
                    {item.rank === 2 && "🥈"}
                    {item.rank === 3 && "🥉"}
                  </div>
                  
                  {/* 1:1 画像 */}
                  <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                    {item.photoUrl ? (
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-rose-100">
                        <span className="text-5xl font-bold text-gray-400">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 情報 */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-2xl font-extrabold text-rose-600">
                    ¥{item.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* その他のランキング */}
      {others.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="divide-y divide-gray-200">
            {others.map((item) => (
              <Link key={item.oshiId} href={`/oshis/${item.slug}`}>
                <div className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50">
                  {/* ランク */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600">
                    {item.rank}
                  </div>

                  {/* 画像 */}
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.photoUrl ? (
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-xl font-bold text-gray-400">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 名前 */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  </div>

                  {/* 金額 */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ¥{item.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 注記 */}
      <p className="text-center text-xs text-gray-500">
        ※決済反映まで最大5分かかる場合があります
      </p>
    </div>
  );
}
