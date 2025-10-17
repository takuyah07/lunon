/**
 * OshiCard - 推しカードコンポーネント
 * 店舗ページやランキングで使用
 */

import Link from "next/link";
import Image from "next/image";

interface OshiCardProps {
  slug: string;
  name: string;
  photoUrl?: string | null;
  profileShort?: string | null;
  showProfile?: boolean;
}

export default function OshiCard({
  slug,
  name,
  photoUrl,
  profileShort,
  showProfile = false,
}: OshiCardProps) {
  return (
    <Link href={`/oshis/${slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-2xl bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        {/* 1:1 画像 */}
        <div className="relative aspect-square w-full overflow-hidden bg-rose-100">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-rose-200">
              <span className="text-5xl font-extrabold text-white drop-shadow-lg">
                {name.charAt(0)}
              </span>
            </div>
          )}
          {/* ホバー時のオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {/* 詳細を見るラベル */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="inline-block rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-gray-900 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
              詳細を見る →
            </span>
          </div>
        </div>

        {/* 情報エリア */}
        <div className="p-4">
          <h3 className="text-center text-lg font-bold text-gray-900 transition-colors group-hover:text-rose-600">
            {name}
          </h3>
          {showProfile && profileShort && (
            <p className="mt-2 line-clamp-2 text-center text-sm text-gray-600">
              {profileShort}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
