# 推しにギフトを送れるサービス MVP

Next.js + Square + Supabaseを使った、店舗内ランキング（月間合計）を表示する最小構成のギフト送信サービスです。

## 🚀 機能

- 推し一覧表示
- ギフトプリセットボタンからSquare決済へ遷移
- 月間ランキング表示（店舗ページ）
- 5分毎の自動同期（Vercel Cron）
- 法務ページ（利用規約・プライバシーポリシー・特商法）

## 📦 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **決済**: Square API
- **デプロイ**: Vercel

## 🛠️ セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、最低限以下を設定：

```bash
# Database (必須)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Site URL (必須)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**Square API設定は任意です。未設定の場合は自動的にテストモード（DRY RUN）で動作します。**

実際のSquare決済を使用する場合のみ、以下を追加：

```bash
# Square API (本番で決済を使う場合のみ)
SQUARE_ENV="sandbox"
SQUARE_ACCESS_TOKEN="your_square_access_token"
SQUARE_LOCATION_ID="your_location_id"
SQUARE_APPLICATION_ID="your_application_id"
```

### 3. データベースのセットアップ

```bash
# Prismaクライアント生成
npm run prisma:generate

# データベースにスキーマを反映
npm run prisma:push

# テストデータ投入
npx tsx prisma/seed.ts
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000/stores/sample-store にアクセス

## 📁 ディレクトリ構造

```
lunon/
├── prisma/
│   ├── schema.prisma         # DBスキーマ定義
│   └── seed.ts               # テストデータ作成スクリプト
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── checkout/     # Square Checkout URL生成
│   │   │   ├── sync/         # Square同期＆月次集計
│   │   │   └── stores/[storeId]/ranking/ # ランキング取得
│   │   ├── stores/[storeSlug]/ # 店舗ページ
│   │   ├── oshis/[oshiSlug]/  # 推し詳細ページ
│   │   └── legal/            # 法務ページ
│   ├── components/
│   │   ├── OshiCard.tsx      # 推しカードコンポーネント
│   │   ├── RankingList.tsx   # ランキング表示
│   │   └── GiftButton.tsx    # ギフトボタン
│   └── lib/
│       ├── db.ts             # Prismaクライアント
│       ├── square.ts         # Square API統合
│       ├── sync.ts           # 同期処理ロジック
│       └── time.ts           # JST時刻処理
├── .env.example              # 環境変数テンプレート
└── vercel.json               # Vercel Cron設定
```

## 🔄 API仕様

### POST /api/checkout

Square Checkout URLを生成

**リクエスト:**
```json
{
  "oshiId": "xxx",
  "presetId": "yyy"
}
```

**レスポンス:**
```json
{
  "url": "https://checkout.square.site/..."
}
```

### POST /api/sync

Square決済を同期してランキング更新（Vercel Cronから5分毎に実行）

**レスポンス:**
```json
{
  "success": true,
  "syncedPayments": 3,
  "updatedStores": 1,
  "lastSyncTime": "2025-10-16T18:00:00.000Z"
}
```

### GET /api/stores/[storeId]/ranking

月間ランキング取得

**レスポンス:**
```json
{
  "month": "2025-10",
  "items": [
    {
      "rank": 1,
      "oshiId": "xxx",
      "name": "花子",
      "slug": "hanako",
      "totalAmount": 53000,
      "photoUrl": null
    }
  ]
}
```

## 🗄️ データベーススキーマ

- **Store**: 店舗情報
- **Oshi**: 推し情報
- **GiftPreset**: ギフトプリセット（金額・Square Catalog Item ID）
- **Payment**: 決済記録
- **MonthlyRankCache**: 月次ランキングキャッシュ

## 🎨 ページ構成

| パス | 説明 |
|------|------|
| `/stores/[storeSlug]` | 店舗ページ（推し一覧＋ランキング） |
| `/oshis/[oshiSlug]` | 推し詳細ページ（プロフィール＋ギフトボタン） |
| `/legal/terms` | 利用規約 |
| `/legal/privacy` | プライバシーポリシー |
| `/legal/tokushoho` | 特定商取引法に基づく表記 |

## ⚙️ Vercel デプロイ設定

### 環境変数

Vercelダッシュボードで以下の環境変数を設定：

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `SQUARE_ENV`
- `SQUARE_ACCESS_TOKEN`
- `SQUARE_LOCATION_ID`
- `SQUARE_APPLICATION_ID`
- `CRON_SECRET` (Vercel Cronで自動生成される)

### Cron設定

`vercel.json` に定義済み（5分毎に `/api/sync` を実行）

## ⚠️ 注意事項

- **MVP版の制限**:
  - Webhook連動なし（5分間隔の同期のみ）
  - 返金処理未対応
  - 認証なし（ゲストのみ）
  - 週次/年次ランキング未対応

- **テストモード（推奨）**:
  - Square環境変数を設定しない場合、自動的にDRY RUNモードで動作
  - ギフトボタンをクリックしてもSquare APIは呼ばれず、テストURLにリダイレクト
  - データベースと画面表示のテストが可能

- **Square設定（本番利用時）**:
  - Sandbox環境で開発・テスト
  - Catalog Itemを事前に作成し、IDをGiftPresetに設定
  - 本番環境では `SQUARE_ENV=production` に変更
  - 明示的に `SQUARE_DRY_RUN=true` を設定してもテストモード可

## 📝 今後の拡張

- [ ] Webhook連動（リアルタイム同期）
- [ ] 返金処理対応
- [ ] 週次・年次ランキング
- [ ] 管理画面（店舗・推し・プリセット管理）
- [ ] 認証機能（会員向け機能）
- [ ] 画像アップロード機能
- [ ] メール通知機能

## 📄 ライセンス

MIT

## 🤝 コントリビューション

Issue・PRをお待ちしています！
