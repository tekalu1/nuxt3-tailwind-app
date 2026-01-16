# 要件定義ガイド

プロジェクトの要件定義ドキュメントの構成と作成方法について説明します。

---

## ディレクトリ構成

```
requirements/
├── README.md              # 本ドキュメント
├── system/                # システム要件（PJ固有アーキテクチャ）
│   ├── README.md         # 概要・ナビゲーション
│   ├── types.md          # 共通型定義（Entity, Response, Request）
│   ├── api-design.md     # API設計（RESTエンドポイント）
│   └── database.md       # データベース設計
└── features/              # 機能要件（ページ・機能・共通機能）
    ├── README.md         # 機能要件ガイド
    ├── _template.md      # テンプレート
    ├── pages/            # ページ単位
    │   ├── user-management.md
    │   ├── product-list.md
    │   └── order-history.md
    ├── features/         # 機能単位
    │   ├── authentication.md
    │   ├── search.md
    │   └── ...
    └── common/           # 共通機能
        ├── form-validation.md
        ├── notification.md
        └── ...
```

---

## 要件の種類

### システム要件 (system/)

プロジェクト固有のシステムアーキテクチャ・技術要件を定義します。

| ドキュメント | 内容 |
|-------------|------|
| [types.md](./system/types.md) | 共通型定義（Entity, Response, Request） |
| [api-design.md](./system/api-design.md) | API設計（RESTエンドポイント） |
| [database.md](./system/database.md) | データベース設計 |

**特徴:**
- プロジェクト固有のアーキテクチャを定義
- 実装時の設計指針となる
- 汎用アーキテクチャ（Nuxt3等）は [development/architecture/](../development/architecture/) を参照

### 機能要件 (features/)

画面・機能単位で「何を実現すべきか」を定義します。3つのカテゴリに分類されています。

| カテゴリ | 内容 | 例 |
|---------|------|-----|
| [pages/](./features/pages/) | ページ単位の要件 | ユーザー管理、商品一覧 |
| [features/](./features/features/) | 機能単位の要件 | 認証、検索機能 |
| [common/](./features/common/) | 共通機能の要件 | フォームバリデーション、通知 |

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

# 機能の場合
cp docs/requirements/features/_template.md docs/requirements/features/features/{機能名}.md

# 共通機能の場合
cp docs/requirements/features/_template.md docs/requirements/features/common/{機能名}.md
```

### 2. 各セクションを記入

詳細は [features/README.md](./features/README.md) を参照してください。

### 3. テストシナリオへのリンクを追加

機能要件書の最後に、関連するテストシナリオへのリンクを記載します。

```markdown
## 関連テストシナリオ

- [E2E: ユーザー管理](../../test/e2e/scenarios/user-management.md)
- [統合: 認証機能](../../test/integration/scenarios/authentication.md)
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
| ホーム | HOME |
| ユーザー管理 | USER |
| 商品一覧 | PROD |
| 商品詳細 | PDET |
| カート | CART |
| 注文 | ORDER |
| 設定 | SET |
| ダッシュボード | DASH |
| 認証 | AUTH |
| 検索 | SRCH |
| 通知 | NOTIF |
| フォーム共通 | FORM |

### 例

| ID | 機能 |
|----|------|
| FR-USER-001 | ユーザー一覧を表示できる |
| FR-USER-002 | ユーザーを新規登録できる |
| FR-PROD-001 | 商品一覧を表示できる |
| FR-AUTH-001 | ログインできる |

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
