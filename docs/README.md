# ドキュメント作成ガイド

このドキュメントでは、プロジェクトのドキュメント体系と、各種ドキュメントの書き方・管理方法について説明します。

---

## ドキュメント体系

プロジェクトのドキュメントは以下の構造で管理されています。

```
docs/
├── README.md                   # 本ドキュメント（全体ナビゲーション・作成ガイド）
├── docs-guide/                 # ドキュメント作成ガイド
│   ├── README.md              # ドキュメント作成ガイド
│   └── generation-guide.md    # ドキュメント自動生成ガイド
└── development/                # 開発関連ドキュメント
    ├── development-guide.md   # 開発ガイド（コーディング規約・フロー）
    ├── guides/                # 各種ガイドライン
    └── architecture/          # アーキテクチャ・設計ドキュメント
        ├── system-design.md   # システム構成図
        ├── security.md        # セキュリティ設計
        ├── state-management.md # 状態管理設計
        ├── deployment.md      # デプロイ戦略
        ├── types/             # 型定義ドキュメント（自動生成）
        ├── api/               # API仕様書（自動生成）
        ├── diagrams/          # 画面遷移図（自動生成）
        └── components/        # コンポーネントカタログ（自動生成）
```

---

## ドキュメントの種類

### 1. 手動作成ドキュメント

プロジェクトの全体像や設計方針を記述する、手動で作成・更新するドキュメントです。

#### docs/（ドキュメントルート）

- **README.md**: 本ドキュメント（全体のナビゲーション・作成ガイド）

#### docs-guide/（ドキュメント作成ガイド）

- **README.md**: ドキュメント作成ガイド
- **generation-guide.md**: ドキュメント自動生成ガイド

#### development/（開発関連）

詳細は、ドキュメント作成ガイドを参照してください:

- [docs-guide/README.md](./docs-guide/README.md)

---

## ドキュメント作成の基本方針

### 1. コードファースト

**実装が第一優先**です。ドキュメントは実装に追従する形で作成・更新します。

```
実装 → ドキュメント自動生成 → 必要に応じて設計ドキュメント更新
```

### 2. DRY（Don't Repeat Yourself）

同じ情報を複数のドキュメントに記載しません。

- 自動生成できるものは自動生成
- 他ドキュメントへのリンクを活用
- 一箇所で管理し、他から参照

### 3. 読み手を意識

- **Webアプリ開発を始めたい**: [development/development-guide.md](./development/development-guide.md) を参照
- **設計を理解したい**: development/architecture/ 配下の設計ドキュメントを参照
- **ドキュメントを作成したい**: 本ドキュメント（README.md）およびドキュメント作成ガイドを参照

---

## Markdown記法のルール

### 見出し

```markdown
# H1: ドキュメントタイトル（1つのみ）

## H2: 主要なセクション

### H3: サブセクション

#### H4: 詳細項目
```

### コードブロック

言語を明示してシンタックスハイライトを有効化します。

````markdown
```typescript
export interface User {
  id: string
  name: string
}
```

```bash
npm install
npm run dev
```

```vue
<template>
  <div>{{ message }}</div>
</template>
```
````

### リンク

#### 相対パス（プロジェクト内ドキュメント）

```markdown
詳細は [開発ガイド](./development/development-guide.md) を参照してください。
```

#### 絶対URL（外部リンク）

```markdown
[Nuxt 3 公式ドキュメント](https://nuxt.com/)
```

### テーブル

```markdown
| カラム1 | カラム2 | カラム3 |
|---|---|---|
| データ1 | データ2 | データ3 |
| データ4 | データ5 | データ6 |
```

### リスト

```markdown
## 順序なしリスト
- 項目1
- 項目2
  - サブ項目2-1
  - サブ項目2-2

## 順序付きリスト
1. ステップ1
2. ステップ2
3. ステップ3

## チェックリスト
- [ ] 未完了タスク
- [x] 完了済みタスク
```

---

## ドキュメント更新のタイミング

### 手動作成ドキュメント

| ドキュメント | 更新タイミング |
|---|---|
| development/development-guide.md | コーディング規約や開発フローが変更されたとき |
| development/architecture/*.md | 設計方針が変更されたとき |

### 自動生成ドキュメント

詳細はドキュメント作成ガイドを参照してください:

- [docs-guide/generation-guide.md](./docs-guide/generation-guide.md)

---

## ドキュメントレビューのポイント

Pull Request時に以下をチェックします。

### 1. 内容の正確性

- [ ] コードと一致しているか
- [ ] 古い情報が残っていないか
- [ ] リンク切れがないか

### 2. 可読性

- [ ] 見出し構造が適切か
- [ ] コードブロックに言語指定があるか
- [ ] 適切に改行・空行が入っているか

### 3. 完全性

- [ ] 必要な情報が揃っているか
- [ ] サンプルコードは動作するか
- [ ] 参考リンクは有効か

---

## ドキュメント管理のベストプラクティス

### 1. 小さく頻繁に更新

大きな変更を一度に行うのではなく、小さな変更をこまめにコミットします。

```bash
# 良い例
git commit -m "docs: development-guide.mdにコーディング規約を追加"

# 悪い例（大量の変更を一度に）
git commit -m "docs: 全ドキュメント更新"
```

### 2. コミットメッセージは `docs:` で始める

[Conventional Commits](https://www.conventionalcommits.org/) に従います。

```bash
docs: development/development-guide.mdにNode.jsバージョン要件を追加
docs: development/architecture/api/README.mdのエラーハンドリングセクションを更新
```

### 3. 画像やダイアグラムは別ファイルで管理

```
docs/
├── images/              # スクリーンショット・図表
│   └── development/
└── development/
    └── diagrams/
```

Mermaidを使える場合はコード化を推奨:

```markdown
## システム構成図

\`\`\`mermaid
graph LR
  Client[クライアント] --> API[Nuxt API]
  API --> DB[(PostgreSQL)]
  API --> S3[AWS S3]
\`\`\`
```

---

## ツール

### 推奨エディタ

- **VS Code**: Markdown All in One拡張機能
- **Markdownプレビュー**: `Ctrl+Shift+V` (Win) / `Cmd+Shift+V` (Mac)

### Linter

```bash
# markdownlintを使用（オプション）
npm install -D markdownlint-cli
npx markdownlint docs/**/*.md
```

---

## トラブルシューティング

### リンクが機能しない

- 相対パスが正しいか確認
- ファイル名の大文字小文字が一致しているか確認（Windowsでは区別されないが、Linuxでは区別される）

### コードブロックのハイライトが効かない

- 言語指定が正しいか確認（`typescript`, `bash`, `vue`など）

### Mermaid図が表示されない

- GitHubではネイティブサポートされています
- ローカルプレビューで見えない場合は、Mermaid対応のMarkdownビューアを使用

---

## 参考資料

- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [Mermaid 公式ドキュメント](https://mermaid.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ドキュメント作成ガイド](./docs-guide/README.md)
