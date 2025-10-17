/**
 * GiftButton - ギフト送信ボタンコンポーネント
 * 推し詳細ページで使用
 * 
 * パフォーマンス最適化:
 * - paymentLinkUrlがある場合：<a>タグで即座に遷移（超高速）
 * - ない場合：API経由で生成（初回のみ）
 */

"use client";

import { useState, useEffect } from "react";

interface GiftButtonProps {
  oshiId: string;
  presetId: string;
  label: string;
  amount: number;
  paymentLinkUrl: string | null;
}

export default function GiftButton({
  oshiId,
  presetId,
  label,
  amount,
  paymentLinkUrl,
}: GiftButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // ブラウザバック時にローディング状態をリセット
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsLoading(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // ✨ キャッシュがある場合：<a>タグで直接遷移（超高速）
  if (paymentLinkUrl) {
    return (
      <a
        href={paymentLinkUrl}
        className="group relative block w-full overflow-hidden rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 font-bold text-white text-center shadow-lg transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-xl"
      >
        <span className="flex items-center justify-center gap-2">
          <span>{label}</span>
          <span className="text-xl">¥{amount.toLocaleString()}</span>
        </span>
      </a>
    );
  }

  // キャッシュがない場合：API経由で生成（初回のみ）
  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oshiId,
          presetId,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout URL generation failed");
      }

      const data = await response.json();
      
      // Square決済ページへリダイレクト
      window.location.href = data.url;
    } catch (error) {
      console.error("Gift button error:", error);
      alert("エラーが発生しました。もう一度お試しください。");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          処理中...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <span>{label}</span>
          <span className="text-xl">¥{amount.toLocaleString()}</span>
        </span>
      )}
    </button>
  );
}
