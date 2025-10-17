/**
 * GET /api/stores/[storeId]/ranking
 * 月次ランキング取得API
 * 
 * レスポンス: {
 *   month: "2025-10",
 *   items: [
 *     { rank: 1, oshiId: "xxx", name: "...", totalAmount: 53000, photoUrl: "..." }
 *   ]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formatMonthYmJst } from "@/lib/time";

interface RankingData {
  oshiId: string;
  totalAmount: number;
  oshi: {
    id: string;
    name: string;
    photoUrl: string | null;
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    const currentMonthYm = formatMonthYmJst();

    console.log("[Ranking API] storeId:", storeId);
    console.log("[Ranking API] currentMonthYm:", currentMonthYm);

    // 当月のランキングキャッシュを取得
    const rankings = await prisma.monthlyRankCache.findMany({
      where: {
        storeId,
        monthYm: currentMonthYm,
      },
      orderBy: {
        totalAmount: "desc",
      },
      include: {
        oshi: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
            slug: true,
          },
        },
      },
    });

    // ランキング形式に変換
    const items = rankings.map((ranking: RankingData, index: number) => ({
      rank: index + 1,
      oshiId: ranking.oshiId,
      name: ranking.oshi.name,
      slug: ranking.oshi.slug,
      totalAmount: ranking.totalAmount,
      photoUrl: ranking.oshi.photoUrl || null,
    }));

    return NextResponse.json({
      month: currentMonthYm,
      items,
    });
  } catch (error) {
    console.error("Ranking API error:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Failed to fetch ranking", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
