# 機能要件ガイド

画面・機能単位の要件定義ドキュメントの作成方法について説明します。

---

## 機能要件定義書とは

機能要件定義書は、各画面・機能が「何を実現すべきか」をユーザー視点で定義するドキュメントです。

### 目的

1. **実装前の要件明確化**: 何を作るべきかを明確にする
2. **テストシナリオの基礎**: テスト設計の入力となる
3. **トレーサビリティの確保**: 要件 → テスト → 実装 の追跡を可能にする

### システム要件との違い

| 項目 | 機能要件 (features/) | システム要件 (system/) |
|------|---------------------|----------------------|
| 形式 | Markdown | TypeScript型定義 |
| 視点 | ユーザー視点 | 技術視点 |
| 粒度 | 画面・機能単位 | データ構造単位 |
| 用途 | テストシナリオ作成 | 実装時の型チェック |

---

## ドキュメント構成

```
features/
├── README.md                    # 本ドキュメント
├── _template.md                 # テンプレート
├── pages/                       # ページ単位の要件
│   ├── flow-editor.md          # フローエディタ画面
│   ├── chat-view.md            # チャットビュー画面
│   └── flow-execution-result-ui.md  # 実行結果UI
├── tools/                       # ビルトインツールの要件
│   ├── agent-tool.md           # Agentツール
│   ├── script-tool.md          # Scriptツール
│   ├── start-tool.md           # Startツール
│   ├── end-tool.md             # Endツール
│   └── magic-flow-tool.md      # MagicFlowツール
└── common/                      # 共通機能の要件
    ├── ai-flow-generation.md   # AIフロー生成
    ├── ai-item-config-generation.md  # AIアイテム設定生成
    ├── flow-editor-auto-save.md      # 自動保存
    ├── flow-editor-undo-redo.md      # 元に戻す/やり直し
    ├── flow-editor-version-history.md # バージョン履歴
    ├── flow-api-publish.md           # API公開
    └── desktop-app-build.md          # デスクトップアプリビルド
```

### カテゴリの分類基準

| カテゴリ | 説明 | 例 |
|---------|------|-----|
| pages/ | ページ単位の要件（Nuxt3のpages/と対応） | フローエディタ、チャットビュー |
| tools/ | ビルトインツール（ノード）の仕様 | Agent、Script、Start/End |
| common/ | 複数ページで共通の機能 | 自動保存、Undo/Redo、AI生成 |

---

## 機能要件定義書の構成

各ドキュメントは以下の構成で作成します。

### 1. 概要

画面の目的と対象ユーザーを記載します。

```markdown
## 1. 概要

### 目的
フローをビジュアルに編集できるエディタを提供する。

### 対象ユーザー
- フロー作成者
- システム管理者
```

### 2. 機能一覧

画面が提供する機能を一覧化します。各機能にはIDを付与します。

```markdown
## 2. 機能一覧

| ID | 機能名 | 説明 | 優先度 |
|----|--------|------|--------|
| FR-FLOW-001 | ノード追加 | キャンバスにノードを追加できる | 必須 |
| FR-FLOW-002 | ノード接続 | ノード間をエッジで接続できる | 必須 |
| FR-FLOW-003 | ノード設定 | ノードのパラメータを設定できる | 必須 |
```

### 3. 画面構成

画面のレイアウトと主要コンポーネントを説明します。

```markdown
## 3. 画面構成

### レイアウト
- 左: ツールパネル（ノード一覧）
- 中央: キャンバス（フロー編集エリア）
- 右: 設定パネル（ノード設定）

### 主要コンポーネント
- ToolPanel: ドラッグ可能なツール一覧
- FlowCanvas: Vue Flow ベースの編集エリア
- ConfigPanel: 選択ノードの設定フォーム
```

### 4. 操作フロー

ユーザーの典型的な操作手順を記載します。

```markdown
## 4. 操作フロー

### 基本フロー: ノードの追加と接続

1. ユーザーがツールパネルからノードをドラッグ
2. キャンバス上でドロップ
3. ノードが追加される
4. ノードの出力ハンドルをドラッグ
5. 別のノードの入力ハンドルにドロップ
6. エッジが作成される
```

### 5. 入出力仕様

入力項目、バリデーション、出力を定義します。

```markdown
## 5. 入出力仕様

### 入力
| 項目 | 型 | 必須 | バリデーション |
|------|-----|------|---------------|
| フロー名 | string | Yes | 1-100文字 |
| 説明 | string | No | 最大1000文字 |

### 出力
- 保存成功時: 成功トースト表示
- 保存失敗時: エラートースト表示
```

### 6. 非機能要件

パフォーマンス、セキュリティなどの非機能要件を記載します。

```markdown
## 6. 非機能要件

### パフォーマンス
- 100ノードまで60fps以上で動作すること
- 保存処理は3秒以内に完了すること

### セキュリティ
- 認証済みユーザーのみアクセス可能
```

### 7. テストシナリオへのリンク

関連するテストシナリオへの参照を記載します。

```markdown
## 7. テストシナリオへのリンク

- [E2E: フローエディタ](../../test/e2e/scenarios/flow-editor.md)
- [統合: ツール実行](../../test/integration/scenarios/tool-execution.md)
```

---

## ID体系

### フォーマット

```
FR-{画面コード}-{連番}
```

### 画面コード一覧

| 画面/機能 | コード | 例 |
|----------|--------|-----|
| フローエディタ | FLOW | FR-FLOW-001 |
| フロー実行 | EXEC | FR-EXEC-001 |
| 変数管理 | VAR | FR-VAR-001 |
| 設定 | SET | FR-SET-001 |
| ダッシュボード | DASH | FR-DASH-001 |
| チャットビュー | CHV | FR-CHV-001 |
| Agentツール | AGT | FR-AGT-001 |
| HTTPツール | HTTP | FR-HTTP-001 |
| Delayツール | DELAY | FR-DELAY-001 |
| startツール | STR | FR-STR-001 |
| endツール | END | FR-END-001 |
| フローAPI公開 | API | FR-API-001 |
| デスクトップアプリビルド | DESKBLD | FR-DESKBLD-001 |

---

## 作成手順

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

上記の構成に従って各セクションを埋めます。

### 3. IDを付与

機能一覧の各項目に一意のIDを付与します。

### 4. テストシナリオを作成

機能要件に基づいて、テストシナリオを作成します。
→ [テストプロセス](../../test/README.md) を参照

### 5. 相互リンクを追加

機能要件書とテストシナリオ間の相互リンクを追加します。

---

## 関連ドキュメント

- [要件定義ガイド](../README.md)
- [テストプロセス](../../test/README.md)
- [開発ガイド](../../development/development-guide.md)
