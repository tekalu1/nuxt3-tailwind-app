# Gitワークフロー

Gitの運用方針とコミット規約について説明します。

---

## ブランチ戦略

プロジェクトでは以下のブランチ戦略を採用しています。

### ブランチの種類

- `main`: 本番環境
- `develop`: 開発環境（オプション）
- `feature/xxx`: 機能追加
- `fix/xxx`: バグ修正
- `refactor/xxx`: リファクタリング
- `docs/xxx`: ドキュメント更新

### ブランチ命名規則

```bash
# ✅ 良い例
feature/user-authentication
fix/login-redirect-bug
refactor/api-error-handling
docs/update-readme

# ❌ 悪い例
feature/UserAuthentication
fix/login_redirect_bug
refactorApiErrorHandling
```

---

## コミット前のチェックリスト

コミット前に必ず以下を実行してください。

### 1. ドキュメント自動生成

```bash
pnpm docs:generate
```

型定義、API仕様書、画面遷移図などを最新化します。

詳細は [ドキュメント自動生成ガイド](../../../docs-guide/generation-guide.md) を参照。

### 2. Lint チェック

```bash
# Lint エラーを確認
pnpm lint

# 自動修正可能なエラーを修正
pnpm lint:fix
```

### 3. 型チェック

```bash
# TypeScript の型エラーをチェック
pnpm typecheck
```

### 4. テスト実行

```bash
# 単体テストを実行
pnpm test:unit

# 全テストを実行（E2Eテスト含む）
pnpm test
```

### チェックリスト

- [ ] `pnpm docs:generate` でドキュメント生成
- [ ] `pnpm lint` でLintエラーなし
- [ ] `pnpm typecheck` で型エラーなし
- [ ] `pnpm test:unit` でテストが全て通過

**推奨**: これらを自動化するため、Git hooksの利用を検討してください（Huskyなど）。

---

## コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/) に準拠します。

### フォーマット

```
<type>: <subject>

<body>
```

### タイプ

- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメント更新
- `test`: テスト追加・修正
- `chore`: ビルド・設定変更
- `style`: コードスタイル修正（動作に影響しない変更）
- `perf`: パフォーマンス改善

### 例

```
feat: ユーザープロフィール編集機能を追加

- プロフィール編集フォームコンポーネント作成
- PUT /api/users/[id] エンドポイント実装
- バリデーション追加
```

```
fix: ログイン後のリダイレクトが正しく動作しない問題を修正

- useRouter の navigateTo を使用するように修正
- リダイレクト先のパスを環境変数から取得
```

```
refactor: API エラーハンドリングを共通化

- createError を使用した統一的なエラー処理
- エラーメッセージの多言語化対応
```

### コミットメッセージのベストプラクティス

#### 1. 件名は50文字以内

```bash
# ✅ 良い例
feat: ユーザープロフィール編集機能を追加

# ❌ 悪い例（長すぎる）
feat: ユーザープロフィール編集機能を追加しました。プロフィール画像のアップロード機能も含みます。
```

#### 2. 本文は詳細に書く

```bash
# ✅ 良い例
feat: ユーザープロフィール編集機能を追加

変更内容:
- プロフィール編集フォームコンポーネント作成
- PUT /api/users/[id] エンドポイント実装
- 画像アップロード機能追加
- バリデーション追加（Zod）

動作確認:
- プロフィール情報の更新が正常に動作
- 画像アップロード・プレビュー機能が動作
- バリデーションエラーが適切に表示

# ❌ 悪い例（詳細がない）
feat: プロフィール編集
```

#### 3. Why（なぜ）を書く

```bash
# ✅ 良い例
refactor: useFetch を useAsyncData に変更

理由:
- SSR時のデータフェッチを最適化するため
- 初期レンダリング時のちらつきを防ぐため

変更内容:
- pages/users/index.vue の useFetch を useAsyncData に変更
- キャッシュキーを明示的に設定

# ❌ 悪い例（Whyがない）
refactor: useFetch を useAsyncData に変更
```

---

## 開発フロー

### 基本的な開発フロー

```bash
# 1. main ブランチから最新を取得
git checkout main
git pull origin main

# 2. 作業ブランチを作成
git checkout -b feature/user-profile

# 3. 実装・テスト
# ... コードを書く ...

# 4. コミット前チェック
pnpm docs:generate
pnpm lint
pnpm typecheck
pnpm test:unit

# 5. ステージング
git add .

# 6. コミット
git commit -m "feat: ユーザープロフィール編集機能を追加

- プロフィール編集フォームコンポーネント作成
- PUT /api/users/[id] エンドポイント実装
- バリデーション追加"

# 7. プッシュ
git push origin feature/user-profile

# 8. Pull Request作成
# GitHubでPRを作成
```

### Pull Request（PR）作成

#### PRタイトル

コミットメッセージと同じ規約に従います。

```
feat: ユーザープロフィール編集機能を追加
```

#### PR本文テンプレート

```markdown
## 概要
ユーザープロフィールの編集機能を実装しました。

## 変更内容
- [ ] プロフィール編集フォームコンポーネント作成
- [ ] PUT /api/users/[id] エンドポイント実装
- [ ] 画像アップロード機能追加
- [ ] バリデーション追加（Zod）
- [ ] 単体テスト追加

## テスト
- [ ] 単体テストが通過
- [ ] E2Eテストが通過
- [ ] 手動テストで動作確認

## スクリーンショット
（必要に応じて画像を添付）

## レビュー観点
- バリデーションロジックの妥当性
- セキュリティ上の問題がないか
- パフォーマンス上の問題がないか

## 関連Issue
Closes #123
```

---

## コミットの修正

### 直前のコミットを修正

```bash
# ファイルを追加して直前のコミットに含める
git add forgotten-file.ts
git commit --amend --no-edit

# コミットメッセージも修正
git commit --amend
```

### コミット履歴の整理（リベース）

```bash
# 最新の3つのコミットを整理
git rebase -i HEAD~3

# または main ブランチとの差分を整理
git rebase -i main
```

**注意**: プッシュ済みのコミットは原則として変更しない。

---

## .gitignore

プロジェクトでは以下のファイル・ディレクトリを無視します。

```gitignore
# Dependencies
node_modules/

# Nuxt
.nuxt/
.output/
dist/

# Environment
.env
.env.local

# Editor
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Test coverage
coverage/

# Storybook
storybook-static/

# Prisma
prisma/migrations/**/migration.sql

# Logs
*.log
```

---

## Git フック（Husky）

推奨: Huskyを使用してコミット前のチェックを自動化します。

### インストール

```bash
pnpm add -D husky lint-staged

# Huskyのセットアップ
pnpm husky install
```

### pre-commit フック

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

### lint-staged 設定

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## トラブルシューティング

### コンフリクトの解決

```bash
# main ブランチの最新を取得
git fetch origin main

# リベースでコンフリクトを解決
git rebase origin/main

# コンフリクトを手動で解決後
git add .
git rebase --continue
```

### 誤ってコミットした場合

```bash
# 直前のコミットを取り消し（変更は保持）
git reset --soft HEAD~1

# 直前のコミットを完全に取り消し
git reset --hard HEAD~1
```

### プッシュを取り消したい場合

```bash
# ⚠️ 注意: 共有ブランチでは使用しない
git push --force-with-lease origin feature/xxx
```

---

## 関連ドキュメント

- [開発ガイド トップ](../development-guide.md)
- [テストガイド](./testing-guide.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
