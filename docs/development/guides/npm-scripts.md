# NPMスクリプト

`package.json` に定義されている主要なスクリプトについて説明します。

---

## 開発

### `npm run dev`

開発サーバーを起動します。

```bash
npm run dev
```

- **URL**: `http://localhost:3000`
- **ホットリロード**: 有効
- **用途**: ローカル開発

### `npm run storybook`

Storybookを起動します。

```bash
npm run storybook
```

- **URL**: `http://localhost:6006`
- **用途**: コンポーネント開発、ビジュアルテスト

詳細は [Storybookガイド](./storybook-guide.md) を参照。

### `npm run db:studio`

Prisma Studioを起動します。

```bash
npm run db:studio
```

- **URL**: `http://localhost:5555`
- **用途**: データベースのGUI管理

---

## ビルド・デプロイ

### `npm run build`

本番用にビルドします。

```bash
npm run build
```

- **出力先**: `.output/`
- **用途**: 本番デプロイ

### `npm run generate`

静的ファイルを生成します（SSG）。

```bash
npm run generate
```

- **出力先**: `.output/public/`
- **用途**: 静的サイトホスティング（Netlify, Vercel など）

### `npm run preview`

ビルド結果をプレビューします。

```bash
npm run preview
```

- **用途**: 本番ビルドの動作確認

---

## テスト

### `npm run test`

すべてのテストを実行します。

```bash
npm run test
```

- **対象**: 単体テスト、統合テスト、E2Eテスト

### `npm run test:unit`

単体テストのみを実行します。

```bash
npm run test:unit
```

- **ツール**: Vitest
- **対象**: utils, composables, components, server/api

### `npm run test:integration`

統合テストを実行します。

```bash
npm run test:integration
```

- **対象**: API連携、コンポーネント間連携

### `npm run test:e2e`

E2Eテストを実行します。

```bash
npm run test:e2e
```

- **ツール**: Playwright
- **対象**: ユーザーフロー、画面遷移

### `npm run test:watch`

ウォッチモードでテストを実行します。

```bash
npm run test:watch
```

- **用途**: 開発中の継続的なテスト実行

### `npm run test:coverage`

テストカバレッジレポートを生成します。

```bash
npm run test:coverage
```

- **出力先**: `coverage/`
- **用途**: カバレッジ確認

詳細は [テストガイド](./testing-guide.md) を参照。

---

## データベース

### `npm run db:migrate`

データベースマイグレーションを実行します。

```bash
npm run db:migrate
```

- **ツール**: Prisma Migrate
- **用途**: スキーマ変更を適用

### `npm run db:studio`

Prisma Studioを起動します（再掲）。

```bash
npm run db:studio
```

- **URL**: `http://localhost:5555`

### `npm run db:seed`

シードデータを投入します。

```bash
npm run db:seed
```

- **用途**: 開発用の初期データ投入

### `npm run db:push`

マイグレーションファイルを作成せずにスキーマを適用します。

```bash
npm run db:push
```

- **用途**: 開発時の素早いスキーマ変更（本番では使用しない）

### `npm run db:reset`

データベースをリセットします。

```bash
npm run db:reset
```

- **⚠️ 注意**: すべてのデータが削除されます

---

## ドキュメント

### `npm run docs:generate`

すべてのドキュメントを生成します。

```bash
npm run docs:generate
```

- **生成内容**: 型定義、API仕様書、画面遷移図
- **用途**: コミット前のドキュメント更新

### `npm run docs:types`

型定義ドキュメントを生成します。

```bash
npm run docs:types
```

- **対象**: `types/` 配下のTypeScript型定義
- **出力先**: `docs/auto-generated/types/`

### `npm run docs:api`

API仕様書を生成します。

```bash
npm run docs:api
```

- **対象**: `server/api/` 配下のAPIエンドポイント
- **出力先**: `docs/auto-generated/api/`

### `npm run docs:flow`

画面遷移図を生成します。

```bash
npm run docs:flow
```

- **対象**: `pages/` 配下のページルーティング
- **出力先**: `docs/auto-generated/flow/`

詳細は [ドキュメント自動生成ガイド](../../../docs-guide/generation-guide.md) を参照。

---

## Lint・フォーマット

### `npm run lint`

Lintチェックを実行します。

```bash
npm run lint
```

- **ツール**: ESLint
- **対象**: TypeScript, Vue ファイル

### `npm run lint:fix`

Lintエラーを自動修正します。

```bash
npm run lint:fix
```

### `npm run format`

コードをフォーマットします。

```bash
npm run format
```

- **ツール**: Prettier
- **対象**: すべてのコードファイル

### `npm run typecheck`

TypeScriptの型チェックを実行します。

```bash
npm run typecheck
```

- **ツール**: vue-tsc
- **用途**: ビルド前の型エラー確認

---

## Storybook

### `npm run storybook`

Storybookを起動します（再掲）。

```bash
npm run storybook
```

### `npm run build-storybook`

Storybookをビルドします。

```bash
npm run build-storybook
```

- **出力先**: `storybook-static/`
- **用途**: Storybookの静的サイト生成（デプロイ用）

---

## その他

### `npm run clean`

ビルド成果物を削除します。

```bash
npm run clean
```

- **削除対象**: `.nuxt/`, `.output/`, `node_modules/.cache/`

### `npm run postinstall`

依存関係インストール後に自動実行されます。

```bash
npm run postinstall
```

- **実行内容**: Prismaクライアント生成、Nuxt型定義生成
- **用途**: 環境セットアップ

---

## スクリプトの組み合わせ

### コミット前チェック

```bash
# すべてのチェックを一度に実行
npm run docs:generate && npm run lint && npm run typecheck && npm run test:unit
```

### 完全なクリーンビルド

```bash
# クリーンアップ → ビルド
npm run clean && npm run build
```

### データベースリセット → シード投入

```bash
npm run db:reset && npm run db:seed
```

---

## カスタムスクリプトの追加

### package.json への追加

```json
{
  "scripts": {
    "custom:script": "echo 'Custom script'"
  }
}
```

### 実行

```bash
npm run custom:script
```

---

## 関連ドキュメント

- [開発ガイド トップ](../development-guide.md)
- [Gitワークフロー](./git-workflow.md)
- [テストガイド](./testing-guide.md)
- [Storybookガイド](./storybook-guide.md)
- [ドキュメント自動生成ガイド](../../../docs-guide/generation-guide.md)
