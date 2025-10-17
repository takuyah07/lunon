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

    // 推し情報取得
    const oshi = await prisma.oshi.findUnique({
      where: { id: oshiId },
      include: {
        store: {
          include: {
            giftTemplates: true,
          },
        },
      },
    });

    if (!oshi) {
      return NextResponse.json(
        { error: "Oshi not found" },
        { status: 404 }
      );
    }

    // ✨ 店舗の共通テンプレートを取得
    const template = await prisma.storeGiftTemplate.findUnique({
      where: { id: presetId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Gift template not found" },
        { status: 404 }
      );
    }

    // 店舗IDが一致するか確認
    if (template.storeId !== oshi.storeId) {
      return NextResponse.json(
        { error: "Invalid template for this oshi" },
        { status: 400 }
      );
    }

    // テンプレートが有効か確認
    if (!template.isActive) {
      return NextResponse.json(
        { error: "This gift template is not active" },
        { status: 400 }
      );
    }

    // ✨ キャッシュチェック: Payment Linkが既に存在する場合は即座に返す
    if (template.paymentLinkUrl) {
      return NextResponse.json({ url: template.paymentLinkUrl });
    }

    // Payment Linkが存在しない場合: Square APIで生成
    const checkoutUrl = await createCheckoutUrl(template.squareCatalogItemId);

    // ✨ DBに保存（次回から高速化）
    await prisma.storeGiftTemplate.update({
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
