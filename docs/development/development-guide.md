# 開発ガイド

このドキュメントでは、プロジェクトの開発方針と各種ガイドラインへのナビゲーションを提供します。

---

## 📖 開発ガイド一覧

### 基本ガイド

#### [コーディング規約](./guides/coding-standards.md)
プロジェクト全体で統一されたコーディングスタイルとベストプラクティス

**主な内容:**
- TypeScript型定義の書き方
- API実装の規約
- JSDocコメントの書き方
- コードスタイル（インデント、セミコロン、クォートなど）

#### [ディレクトリ構成](./guides/directory-structure.md)
プロジェクトのディレクトリ構造と各フォルダの役割

**主な内容:**
- プロジェクト全体のディレクトリ構成
- 各ディレクトリの詳細説明
- ファイル配置の基準

#### [命名規則](./guides/naming-conventions.md)
ファイル名、変数名、関数名などの命名ルール

**主な内容:**
- ファイル名の規則（コンポーネント、API、テストなど）
- 変数・関数名の規則
- 型・インターフェース名の規則
- データベース、API、環境変数の命名規則

---

### Nuxt 3 関連

#### [Nuxt 3 オートインポート](./guides/nuxt-auto-import.md)
Nuxt 3のオートインポート機能の使い方と注意点

**主な内容:**
- オートインポート対象と使用方法
- 明示的なインポートが必要なもの
- コンポーネントのオートインポート
- トラブルシューティング

---

### コンポーネント開発

#### [コンポーネント開発ガイドライン](./guides/component-guidelines.md)
Vue 3 コンポーネントの設計と実装ガイドライン

**主な内容:**
- Atomic Design に基づく設計
- コンポーネントのディレクトリ構成
- コンポーネントの配置基準
- Props/Emitsの型定義
- コンポーネント設計のベストプラクティス
- パフォーマンス最適化
- アクセシビリティ

#### [Storybookガイド](./guides/storybook-guide.md)
Storybookを使用したコンポーネント開発とドキュメント化

**主な内容:**
- Storybook環境でのVue APIの明示的インポート
- ストーリーファイルの作成方法
- モックデータの使用
- インタラクティブなストーリーの作成
- Tailwind CSSの設定
- トラブルシューティング

---

### テスト

#### [テストガイド](./guides/testing-guide.md)
プロジェクトのテスト戦略とテストの書き方

**主な内容:**
- テストツールとカバレッジ目標
- テストファイル配置ルール（ディレクトリ構造を実装と対応させる）
- **実装変更時のテスト確認フロー**
  - 影響範囲の特定（変更内容ごとの必要なテストの判断表）
  - テストの追加・修正判断
- テストの種類ごとの確認ポイント
  - 単体テスト
  - 統合テスト
  - E2Eテスト
  - Storybookストーリー
- テスト作成のベストプラクティス
- テスト関連のチェックリスト

---

### Git・開発フロー

#### [Gitワークフロー](./guides/git-workflow.md)
Gitの運用方針とコミット規約

**主な内容:**
- ブランチ戦略
- コミット前のチェックリスト
- コミットメッセージ規約（Conventional Commits）
- 開発フロー
- Pull Request作成
- .gitignore設定
- Git フック（Husky）

#### [NPMスクリプト](./guides/npm-scripts.md)
よく使うNPMスクリプトの一覧と説明

**主な内容:**
- 開発用スクリプト（dev, storybook, db:studio）
- ビルド・デプロイスクリプト
- テストスクリプト
- データベーススクリプト
- ドキュメント生成スクリプト
- Lint・フォーマットスクリプト

---

## 🚀 開発フロー

### 基本的な実装フロー（Spec駆動開発）

```
1. Issue/タスク確認
   ↓
2. ブランチ作成（feature/xxx）
   ↓
3. 計画作成（docs/plans/）
   ↓
4. 要件定義の更新（docs/requirements/）
   ↓
5. 仕様・設計の更新（docs/development/architecture/）
   ↓
6. テストシナリオ作成（docs/test/）
   ↓
7. テストコード実装・実行
   ↓
8. 機能実装
   ├── 型定義の作成・更新（types/）
   ├── サーバーAPI実装（server/api/）
   ├── コンポーネント実装（components/）
   ├── Storybook作成（UIコンポーネントの場合）
   └── ページ実装（pages/）
   ↓
9. ドキュメント更新
   ↓
10. コミット・プッシュ
   ↓
11. Pull Request作成
```

詳細は [Gitワークフロー](./guides/git-workflow.md) を参照。

---

## 📝 重要な原則

### 1. Spec駆動開発

本プロジェクトは**Spec駆動開発**を採用しています。

**コードを変更する前に、必ず仕様を先に定義・更新してください。**

```
仕様更新 → テスト作成 → 実装
```

- **仕様優先**: コード変更の前に `docs/requirements/` や `docs/development/architecture/` を更新
- **型安全性の重視**: TypeScript の型システムを最大限活用
- **自動化の推進**: ドキュメント生成、テスト、デプロイを自動化
- **コードの再利用**: Composition API と Composables で共通ロジックを抽出

詳細は [docs/README.md の「開発プロセスとドキュメントの関係」](../README.md#開発プロセスとドキュメントの関係) を参照してください。

### 2. ドキュメント戦略

仕様ドキュメントを先に作成し、実装の指針とします。
また、実装したコードから各種ドキュメントを自動生成することで、ドキュメントとコードの乖離を防ぎます。

詳細は [ドキュメント自動生成ガイド](../../docs-guide/generation-guide.md) を参照してください。

### 3. テスト

- 仕様に基づいてテストシナリオを作成
- テストコードを実装・実行してから機能を実装
- テストファイルのディレクトリ構造は実装ファイルと対応させる

詳細は [テストガイド](./guides/testing-guide.md) を参照してください。

---

## 🔍 実装前の確認事項

### チェックリスト

- [ ] 計画を作成した（docs/plans/）
- [ ] 要件定義を更新した（docs/requirements/）
- [ ] 仕様・設計を更新した（docs/development/architecture/）
- [ ] テストシナリオを作成した（docs/test/）
- [ ] 関連するドキュメントを読んだ
- [ ] 既存のコードスタイルを確認した
- [ ] 型定義を適切に記述した
- [ ] JSDocコメントを記述した（公開API・型定義）
- [ ] バリデーションを実装した（ユーザー入力がある場合）
- [ ] エラーハンドリングを実装した
- [ ] Storybookストーリーを作成した（UIコンポーネントの場合）
- [ ] テストを作成・実行した
- [ ] ドキュメントを更新した
- [ ] コミットメッセージが規約に従っている

---

## 📚 参考資料

### プロジェクトドキュメント

- [README](../../../README.md) - プロジェクト概要、全体ナビゲーション
- [ドキュメント作成ガイド](../../README.md) - ドキュメントの書き方
- [ドキュメント自動生成ガイド](../../docs-guide/generation-guide.md)
- [アーキテクチャドキュメント](./architecture/) - 設計ドキュメント一覧
  - [システム設計](./architecture/system-design.md)
  - [データベース設計](./architecture/database-design.md)
  - [API設計](./architecture/api/README.md)
  - [セキュリティ設計](./architecture/security.md)
  - [状態管理設計 (Pinia)](./architecture/state-management.md)

### 外部資料

- [Nuxt 3 公式ドキュメント](https://nuxt.com/)
- [Vue 3 公式ドキュメント](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Storybook](https://storybook.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ❓ 不明点がある場合

1. まず [開発ガイド一覧](#-開発ガイド一覧) から関連するガイドを確認
2. 関連する [アーキテクチャドキュメント](./architecture/) を確認
3. それでも不明な場合は、ユーザーに質問する

---

**各ガイドを参照して、一貫性のある高品質なコードとドキュメントを維持しましょう。**
