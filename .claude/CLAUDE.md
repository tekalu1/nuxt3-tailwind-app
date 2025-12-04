# プロジェクト規約

## ドキュメント参照ガイド

本プロジェクトには docs/ ディレクトリに詳細なドキュメントが整備されています。
以下を参照し、常に適切なドキュメントを参照してから作業に取り掛かってください。

### ドキュメント構造

```
docs/
├── README.md                      # ドキュメント全体のナビゲーション
├── docs-guide/                    # ドキュメント作成ガイド
│   ├── README.md                  # ドキュメント作成方法
│   └── generation-guide.md        # 自動生成ガイド
├── development/                   # 開発関連ドキュメント
│   ├── development-guide.md       # 開発ガイド（メインエントリポイント）
│   ├── guides/                    # 各種ガイドライン
│   │   ├── coding-standards.md    # コーディング規約
│   │   ├── component-guidelines.md # コンポーネント開発ガイドライン
│   │   ├── directory-structure.md # ディレクトリ構成
│   │   ├── git-workflow.md        # Gitワークフロー
│   │   ├── naming-conventions.md  # 命名規則
│   │   ├── npm-scripts.md         # NPMスクリプト
│   │   ├── nuxt-auto-import.md    # Nuxt 3 オートインポート
│   │   ├── storybook-guide.md     # Storybookガイド
│   │   └── testing-guide.md       # テストガイド
│   └── architecture/              # アーキテクチャ・設計
│       ├── system-design.md       # システム設計
│       ├── security.md            # セキュリティ設計
│       ├── state-management.md    # 状態管理設計（Pinia）
│       ├── deployment.md          # デプロイ戦略
│       └── api/README.md          # API設計
└── plans/                         # 実装計画
    ├── README.md                  # 計画管理ガイド
    └── _template/                 # 計画テンプレート
```

### 参照すべきタイミング

| 状況 | 参照するドキュメント |
|------|----------------------|
| 実装を始める前 | docs/development/development-guide.md |
| コーディング規約を確認したい | docs/development/guides/coding-standards.md |
| コンポーネント作成時 | docs/development/guides/component-guidelines.md |
| ディレクトリ構成を確認したい | docs/development/guides/directory-structure.md |
| 命名規則を確認したい | docs/development/guides/naming-conventions.md |
| Nuxtのオートインポートについて | docs/development/guides/nuxt-auto-import.md |
| テストを書く時 | docs/development/guides/testing-guide.md |
| Storybookを使う時 | docs/development/guides/storybook-guide.md |
| Git操作・コミット規約 | docs/development/guides/git-workflow.md |
| NPMスクリプトを確認したい | docs/development/guides/npm-scripts.md |
| システム設計を確認したい | docs/development/architecture/system-design.md |
| セキュリティ設計を確認したい | docs/development/architecture/security.md |
| 状態管理（Pinia）について | docs/development/architecture/state-management.md |
| API設計について | docs/development/architecture/api/README.md |
| 新しい計画を立てる時 | docs/plans/README.md |

## サブエージェント活用ガイド

本プロジェクトでは `.claude/agents/` 配下に専門エージェントが用意されています。
**適切な場面で積極的にサブエージェントを使用し、可能な限り並列実行してください。**

### 利用可能なエージェント

| エージェント | 用途 |
|-------------|------|
| `developer` | コンポーネント作成、Piniaストア実装、Tailwindスタイリング、Nuxt 3開発全般 |
| `refactor-engineer` | コード・ドキュメントのリファクタリング計画と実行、構造改善、移行作業 |

### エージェント使用の判断基準

以下の場合は **必ず** 該当エージェントを使用してください：

**developer を使用する場面:**
- Vueコンポーネントの新規作成・修正
- Piniaストアの作成・更新
- Tailwind CSSによるスタイリング作業
- ページやレイアウトの実装

**refactor-engineer を使用する場面:**
- 複数ファイルにまたがる構造変更
- コードの共通化・整理
- Atomic Designへの再編成
- ドキュメントの大規模更新
- APIパターンや状態管理の移行

### 並列実行の原則

**複数の独立したタスクがある場合、必ず並列でサブエージェントを起動してください。**

```
良い例（並列実行）:
ユーザー: "ボタンコンポーネントとカードコンポーネントを作成して"
→ 2つの developer エージェントを同時に起動

良い例（並列実行）:
ユーザー: "商品一覧ページと商品詳細ページを作成して"
→ 2つの developer エージェントを同時に起動

良い例（並列実行）:
ユーザー: "ユーザーストアとカートストアを作成して"
→ 2つの developer エージェントを同時に起動
```

### 依存関係がある場合

タスク間に依存関係がある場合のみ順次実行してください：

```
順次実行が必要な例:
ユーザー: "ボタンコンポーネントを作成し、それを使ったフォームを作成して"
→ まずボタンを作成 → 完了後にフォームを作成
```

### 注意事項

- 単純な1ファイルの編集や小さな修正には、エージェントを使わず直接対応して構いません
- エージェントの結果はユーザーに要約して報告してください
- 複数エージェントを起動する際は、**必ず単一のメッセージ内で複数のTaskツールを呼び出してください**
