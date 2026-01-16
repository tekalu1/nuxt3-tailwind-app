# プロジェクト規約

## 開発方針

本プロジェクトは**Spec駆動開発**を採用しています。

コードを変更する前に、必ず仕様を先に定義・更新してください。

### 開発プロセス

変更を加える場合は、以下の順序で進めてください：

```
1. 計画作成（docs/plans/）
   ├── Phase 0: 初期ヒアリング（調査前）
   │   └── 目的・スコープ・受け入れ基準を確認
   ├── Phase A: 事前調査
   │   └── 現状分析、影響範囲、技術調査、リスク特定
   ├── Phase A': 確認ヒアリング（調査後）
   │   └── 技術選択、スコープ調整、リスク対応を確認
   └── Phase B: 計画書作成
       └── 変更の目的、影響範囲、タスク分割を定義
       ↓
2. 要件定義・仕様の更新
   ├── 要件定義（docs/requirements/）
   └── 仕様・設計（docs/development/）
       ↓
3. テスト作成（docs/test/）
   └── テストシナリオ・テストケースを定義
       ↓
4. テスト実施
   └── テストコードを実装・実行
       ↓
5. 実装
   └── 仕様に基づいてコードを実装
       ├── コンポーネント実装
       └── Storybook作成（UIコンポーネントの場合）
```

### ヒアリングプロセス

計画作成時は、ユーザーとのヒアリングを通じて要件を固めます。

**特徴：**
- **選択肢ベース**: 可能な限り選択肢を提示し、ユーザーの負担を軽減
- **2段階実施**: 調査前（初期）と調査後（確認）の2回
- **動的生成**: 汎用テンプレート＋プロジェクト固有の選択肢

**初期ヒアリング（Phase 0）で確認する項目：**
- ビジネス目的・背景
- スコープ・優先度
- 受け入れ基準

**確認ヒアリング（Phase A'）で確認する項目：**
- 技術的アプローチの選択
- スコープ調整
- リスク対応方針

詳細は [docs/README.md の「開発プロセスとドキュメントの関係」](docs/README.md#開発プロセスとドキュメントの関係) を参照してください。

---

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
| 改修・新機能の計画作成 | docs/plans/README.md |
| 新機能の要件定義 | docs/requirements/features/README.md |
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
