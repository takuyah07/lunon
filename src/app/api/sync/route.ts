/**
 * POST /api/sync
 * Square決済同期＆月次集計API
 * 
 * Vercel Cronから5分毎に呼ばれる
 * Authorization: Bearer <CRON_SECRET>
 * 
 * レスポンス: { syncedPayments, updatedStores, lastSyncTime }
 */

import { NextRequest, NextResponse } from "next/server";
import { runSyncAndAggregation } from "@/lib/sync";

export async function POST(request: NextRequest) {
  try {
    // Vercel Cron認証チェック（本番環境のみ）
    if (process.env.NODE_ENV === "production") {
      const authHeader = request.headers.get("authorization");
      const cronSecret = process.env.CRON_SECRET;

      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    console.log("[API /sync] Starting sync job");

    // 同期＆集計実行
    const result = await runSyncAndAggregation();

    console.log("[API /sync] Completed:", result);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Sync API error:", error);
    return NextResponse.json(
      { 
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// 手動実行用（開発環境のみ）
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "GET method not allowed in production" },
      { status: 405 }
    );
  }

  try {
    console.log("[API /sync] Manual sync triggered");
    const result = await runSyncAndAggregation();
    
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Manual sync error:", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
