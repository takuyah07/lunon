/**
 * POST /api/checkout
 * Square Checkout URL生成API（自動キャッシュ機能付き）
 * 
 * パフォーマンス最適化:
 * - Payment LinkがDBに存在する場合：即座に返す（0.1秒以下）
 * - 存在しない場合：Square APIで生成してDBに保存（初回のみ）
 * 
 * リクエスト: { oshiId: string, presetId: string }
 * レスポンス: { url: string } | { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createCheckoutUrl } from "@/lib/square";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { oshiId, presetId } = body;

    // バリデーション
    if (!oshiId || !presetId) {
      return NextResponse.json(
        { error: "oshiId and presetId are required" },
        { status: 400 }
      );
    }

    // GiftPreset取得
    const preset = await prisma.giftPreset.findUnique({
      where: { id: presetId },
      include: { oshi: true },
    });

    if (!preset) {
      return NextResponse.json(
        { error: "Gift preset not found" },
        { status: 404 }
      );
    }

    // 推しIDが一致するか確認
    if (preset.oshiId !== oshiId) {
      return NextResponse.json(
        { error: "Invalid oshiId for this preset" },
        { status: 400 }
      );
    }

    // プリセットが有効か確認
    if (!preset.isActive) {
      return NextResponse.json(
        { error: "This gift preset is not active" },
        { status: 400 }
      );
    }

    // ✨ キャッシュチェック: Payment Linkが既に存在する場合は即座に返す
    if (preset.paymentLinkUrl) {
      return NextResponse.json({ url: preset.paymentLinkUrl });
    }

    // Payment Linkが存在しない場合: Square APIで生成
    const checkoutUrl = await createCheckoutUrl(preset.squareCatalogItemId);

    // ✨ DBに保存（次回から高速化）
    await prisma.giftPreset.update({
      where: { id: presetId },
      data: { paymentLinkUrl: checkoutUrl },
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout URL" },
      { status: 500 }
    );
  }
}
