# 🚀 クイックスタートガイド

Square設定なしで、すぐにテストできる手順です。

## 📋 前提条件

- Node.js 18以降
- PostgreSQLデータベース（SupabaseまたはローカルのPostgreSQL）

## ⚡ 3ステップでスタート

### ステップ1: 環境変数を設定

`.env.local` ファイルを作成：

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/lunon"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

💡 **Supabaseを使う場合:**
1. [Supabase](https://supabase.com/)でプロジェクト作成
2. Settings > Database > Connection stringをコピー
3. `DATABASE_URL` に設定

### ステップ2: データベースをセットアップ

```bash
# Prismaクライアント生成
npm run prisma:generate

# データベースにテーブル作成
npm run prisma:push

# テストデータ投入（店舗1件、推し3人、ギフトプリセット9個、サンプル決済15件）
npx tsx prisma/seed.ts
```

### ステップ3: 開発サーバー起動

```bash
npm run dev
```

## 🎉 完了！

ブラウザで以下のURLにアクセス：

**店舗ページ（ランキング表示）:**
http://localhost:3000/stores/sample-store

**推し詳細ページ:**
- http://localhost:3000/oshis/hanako
- http://localhost:3000/oshis/asami
- http://localhost:3000/oshis/sakura

## 🧪 テストモードについて

Square環境変数を設定していないため、**自動的にDRY RUNモード**で動作します：

- ✅ データベース操作は正常動作
- ✅ ページ表示・ランキング表示が確認可能
- ✅ ギフトボタンクリックでテストURLにリダイレクト
- ❌ 実際のSquare決済は行われない

## 📊 動作確認ポイント

1. **店舗ページ**
   - [ ] 推し3人が表示される
   - [ ] 今月のランキングが表示される（サンプルデータの合計金額順）
   - [ ] 各推しカードをクリックで詳細ページへ遷移

2. **推し詳細ページ**
   - [ ] プロフィールが表示される
   - [ ] ギフトボタン3つ（¥1,000 / ¥3,000 / ¥5,000）が表示される
   - [ ] ボタンクリックでテストURLにリダイレクト

3. **法務ページ**
   - [ ] 利用規約、プライバシーポリシー、特商法が閲覧可能

## 🛠️ トラブルシューティング

### データベース接続エラー

```bash
# PostgreSQLが起動しているか確認（Macの場合）
brew services list

# Supabaseの場合、接続文字列を確認
# プロジェクトの Settings > Database > Connection string
```

### Prismaエラー

```bash
# Prismaクライアントを再生成
npm run prisma:generate

# データベースをリセット（全データ削除）
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

### シードデータが作成されない

```bash
# NODE_ENVを明示的に設定して実行
NODE_ENV=development npx tsx prisma/seed.ts
```

## 🔄 データリセット

テストデータをやり直したい場合：

```bash
# 全データ削除 + テーブル再作成 + シード
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

## 📝 次のステップ

基本動作を確認したら、以下にチャレンジしてみましょう：

1. **データ編集**: Prisma Studioで店舗・推しデータを編集
   ```bash
   npm run prisma:studio
   ```

2. **Square連携**: 実際の決済テストをしたい場合は[README.md](./README.md)のSquare設定を参照

3. **カスタマイズ**: デザインやテキストを好みに変更

## 💬 困ったときは

- [README.md](./README.md) - 詳細なドキュメント
- [Issues](https://github.com/your-repo/issues) - バグ報告・質問

---

Happy Coding! 🎊
