# ドキュメントナビゲーション

プロジェクトのドキュメント体系と、開発プロセスについて説明します。

---

## ドキュメント体系

```
docs/
├── README.md                      # 本ドキュメント（全体ナビゲーション）
│
├── requirements/                  # 要件定義
│   ├── README.md                  # 要件定義ガイド
│   ├── system/                    # システム要件（型定義）
│   │   ├── core.ts               # コア要件
│   │   ├── tools.ts              # ツール要件
│   │   └── database.ts           # DB要件
│   └── features/                  # 機能要件（画面別）
│       ├── README.md             # 機能要件ガイド
│       ├── _template.md          # テンプレート
│       └── {画面名}.md           # 各画面の機能要件
│
├── test/                          # テストドキュメント
│   ├── README.md                  # テストプロセス全体
│   ├── integration/               # 統合テスト
│   │   ├── README.md
│   │   └── scenarios/            # シナリオ・パターン
│   │       ├── _template.md
│   │       └── {機能名}.md
│   └── e2e/                       # E2Eテスト
│       ├── README.md
│       └── scenarios/
│           ├── _template.md
│           └── {機能名}.md
│
├── development/                   # 開発ガイド
│   ├── development-guide.md       # 開発ガイド（メインエントリ）
│   ├── guides/                    # 各種ガイドライン
│   │   ├── coding-standards.md   # コーディング規約
│   │   ├── testing-guide.md      # テストガイド
│   │   └── ...
│   └── architecture/              # アーキテクチャ設計
│       ├── system-design.md
│       └── ...
│
├── docs-guide/                    # ドキュメント作成ガイド
│   ├── README.md
│   └── generation-guide.md
│
└── plans/                         # 実装計画
    ├── README.md
    └── {計画名}/plan.md
```

---

## 開発プロセスとドキュメントの関係

本プロジェクトは**Spec駆動開発**を採用しています。
コードを変更する前に、必ず仕様を先に定義・更新してください。

### 全体フロー

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   計画作成    │ → │  要件定義     │ → │  仕様・設計   │ → │   テスト     │ → │    実装      │
│              │   │              │   │              │   │              │   │              │
│ plans/       │   │ requirements/│   │ development/ │   │ test/        │   │ components/  │
│ {計画名}/    │   │ features/    │   │ architecture/│   │ scenarios/   │   │ server/      │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

### 詳細フロー

```
1. 計画作成
   └── plans/{計画名}/plan.md
       ├── 変更の目的・背景
       ├── 影響範囲の特定
       └── タスク分割
           │
           ▼
2. 要件定義・仕様の更新
   ├── requirements/features/{画面名}.md
   │   ├── 機能一覧
   │   ├── 操作フロー
   │   └── 入出力仕様
   │
   └── development/architecture/*.md
       └── 設計・仕様の更新
           │
           ▼
3. テストシナリオ作成
   └── test/{type}/scenarios/{機能名}.md
       ├── ユーザーストーリー
       ├── テストパターンマトリクス
       └── テストケース一覧
           │
           ▼
4. テストコード実装・実行
   └── tests/{type}/{path}/*.test.ts
       └── シナリオに基づくテストケース
           │
           ▼
5. 実装
   └── 仕様に基づく実装
       ├── コンポーネント実装
       ├── Storybook作成（UIコンポーネントの場合）
       └── テストでの検証
```

---

## クイックリファレンス

### 開発を始めるとき

| やりたいこと | 参照するドキュメント |
|-------------|---------------------|
| 開発環境をセットアップしたい | [development/development-guide.md](./development/development-guide.md) |
| コーディング規約を確認したい | [development/guides/coding-standards.md](./development/guides/coding-standards.md) |
| コンポーネントを作成したい | [development/guides/component-guidelines.md](./development/guides/component-guidelines.md) |

### 機能を追加・変更するとき

| ステップ | 参照するドキュメント |
|---------|---------------------|
| 1. 計画を作成する | [plans/README.md](./plans/README.md) |
| 2. 要件定義を行う | [requirements/features/README.md](./requirements/features/README.md) |
| 3. 仕様・設計を更新する | [development/architecture/](./development/architecture/) |
| 4. テストシナリオを作成する | [test/README.md](./test/README.md) |
| 5. テストを実装・実行する | [development/guides/testing-guide.md](./development/guides/testing-guide.md) |
| 6. 機能を実装する | [development/development-guide.md](./development/development-guide.md) |

### 設計を理解するとき

| やりたいこと | 参照するドキュメント |
|-------------|---------------------|
| システム全体の構成を知りたい | [development/architecture/system-design.md](./development/architecture/system-design.md) |
| 状態管理の設計を知りたい | [development/architecture/state-management.md](./development/architecture/state-management.md) |
| API設計を知りたい | [development/architecture/api/README.md](./development/architecture/api/README.md) |

### ドキュメントを作成するとき

| やりたいこと | 参照するドキュメント |
|-------------|---------------------|
| ドキュメントの書き方を知りたい | [docs-guide/README.md](./docs-guide/README.md) |
| 自動生成ドキュメントについて | [docs-guide/generation-guide.md](./docs-guide/generation-guide.md) |

---

## トレーサビリティ

要件からテストまでの追跡可能性を確保するため、以下のID体系を使用します。

### ID体系

| 種類 | フォーマット | 例 |
|-----|-------------|-----|
| 機能要件 | `FR-{画面}-{番号}` | FR-FLOW-001 |
| テストケース(E2E) | `TC-E2E-{シナリオ}-{番号}` | TC-E2E-FLOW-001 |
| テストケース(統合) | `TC-IT-{シナリオ}-{番号}` | TC-IT-TOOL-001 |

### 相互参照

```markdown
# 機能要件書内
## テストシナリオへのリンク
- [フローエディタE2Eシナリオ](../test/e2e/scenarios/flow-editor.md)

# テストシナリオ内
## 関連機能要件
- [FR-FLOW-001](../../requirements/features/flow-editor.md#fr-flow-001)
```

---

## ドキュメント更新のルール

**重要**: コードを変更する前に、必ず仕様を先に更新してください。

### 新機能追加時

1. `plans/{計画名}/plan.md` に計画を作成
2. `requirements/features/{画面名}.md` に機能要件を追加
3. `development/architecture/*.md` に設計・仕様を追加
4. `test/{type}/scenarios/{機能名}.md` にシナリオを追加
5. テストコードを実装・実行
6. 機能を実装
7. シナリオドキュメントの実装状況を更新

### 機能変更時

1. `plans/{計画名}/plan.md` に変更計画を作成
2. `requirements/features/{画面名}.md` の要件を更新
3. `development/architecture/*.md` の仕様を更新
4. `test/{type}/scenarios/{機能名}.md` のシナリオを更新
5. テストコードを更新・実行
6. 機能を実装
7. ドキュメントの実装状況を更新

### バグ修正時

1. 関連する仕様・テストシナリオを確認
2. 仕様に不備があれば仕様を修正
3. 不足しているテストケースを追加
4. テストコードを追加
5. 修正を実装
6. シナリオドキュメントを更新

---

## 関連リンク

- [開発ガイド](./development/development-guide.md)
- [要件定義ガイド](./requirements/README.md)
- [テストプロセス](./test/README.md)
- [実装計画一覧](./plans/README.md)
