# 要件定義ガイド

プロジェクトの要件定義ドキュメントの構成と作成方法について説明します。

---

## ディレクトリ構成

```
requirements/
├── README.md              # 本ドキュメント
├── system/                # システム要件（PJ固有アーキテクチャ）
│   ├── README.md         # 概要・ナビゲーション
│   ├── core-types.md     # コア型定義（Flow, Tool, Agent, Todo）
│   ├── execution-engine.md # 実行エンジン設計
│   ├── database.md       # データベース設計（LowDB）
│   ├── builtin-tools.md  # ビルトインツール一覧
│   └── api.md            # API設計（REST/WebSocket）
└── features/              # 機能要件（ページ・ツール・共通機能）
    ├── README.md         # 機能要件ガイド
    ├── _template.md      # テンプレート
    ├── pages/            # ページ単位
    │   ├── flow-editor.md
    │   ├── chat-view.md
    │   └── flow-execution-result-ui.md
    ├── tools/            # ビルトインツール
    │   ├── agent-tool.md
    │   ├── script-tool.md
    │   └── ...
    └── common/           # 共通機能
        ├── ai-flow-generation.md
        ├── flow-editor-auto-save.md
        └── ...
```

---

## 要件の種類

### システム要件 (system/)

プロジェクト固有のシステムアーキテクチャ・技術要件を定義します。

| ドキュメント | 内容 |
|-------------|------|
| [core-types.md](./system/core-types.md) | コア型定義（Flow, Tool, Agent, Todo, Trigger） |
| [execution-engine.md](./system/execution-engine.md) | 実行エンジン設計 |
| [database.md](./system/database.md) | データベース設計（LowDB） |
| [builtin-tools.md](./system/builtin-tools.md) | ビルトインツール一覧 |
| [api.md](./system/api.md) | API設計（REST/WebSocket） |

**特徴:**
- プロジェクト固有のアーキテクチャを定義
- 実装時の設計指針となる
- 汎用アーキテクチャ（Nuxt3等）は [development/architecture/](../development/architecture/) を参照

### 機能要件 (features/)

画面・機能単位で「何を実現すべきか」を定義します。3つのカテゴリに分類されています。

| カテゴリ | 内容 | 例 |
|---------|------|-----|
| [pages/](./features/pages/) | ページ単位の要件 | フローエディタ、チャットビュー |
| [tools/](./features/tools/) | ビルトインツールの要件 | Agent、Script、Start/End |
| [common/](./features/common/) | 共通機能の要件 | 自動保存、Undo/Redo、AI生成 |

**特徴:**
- ユーザー視点で機能を記述
- テストシナリオの元になる
- ID体系で追跡可能

---

## 機能要件の作成方法

### 1. テンプレートをコピー

```bash
# ページの場合
cp docs/requirements/features/_template.md docs/requirements/features/pages/{ページ名}.md

# ツールの場合
cp docs/requirements/features/_template.md docs/requirements/features/tools/{ツール名}-tool.md

# 共通機能の場合
cp docs/requirements/features/_template.md docs/requirements/features/common/{機能名}.md
```

### 2. 各セクションを記入

詳細は [features/README.md](./features/README.md) を参照してください。

### 3. テストシナリオへのリンクを追加

機能要件書の最後に、関連するテストシナリオへのリンクを記載します。

```markdown
## 関連テストシナリオ

- [E2E: フローエディタ](../../test/e2e/scenarios/flow-editor.md)
- [統合: ツール実行](../../test/integration/scenarios/tool-execution.md)
```

---

## ID体系

機能要件には一意のIDを付与し、トレーサビリティを確保します。

### フォーマット

```
FR-{画面コード}-{連番}
```

### 画面コード一覧

| 画面/機能 | コード |
|----------|-------|
| フローエディタ | FLOW |
| フロー実行 | EXEC |
| 変数管理 | VAR |
| 設定 | SET |
| ダッシュボード | DASH |
| チャットビュー | CHV |
| Agentツール | AGT |
| HTTPツール | HTTP |
| Delayツール | DELAY |
| startツール | STR |
| endツール | END |
| フローAPI公開 | API |
| デスクトップアプリビルド | DESKBLD |

### 例

| ID | 機能 |
|----|------|
| FR-FLOW-001 | フローにノードを追加できる |
| FR-FLOW-002 | ノード間を接続できる |
| FR-EXEC-001 | フローを実行できる |

---

## 変更管理

### 機能要件の変更時

1. 機能要件書を更新
2. 影響を受けるテストシナリオを特定（IDで検索）
3. テストシナリオを更新
4. テストコードを更新
5. 実装を更新

### 新規機能追加時

1. 機能要件書に新規IDで追記
2. テストシナリオを作成
3. テストコードを実装
4. 機能を実装

---

## 関連ドキュメント

- [機能要件ガイド](./features/README.md)
- [テストプロセス](../test/README.md)
- [開発ガイド](../development/development-guide.md)
