# ドキュメント作成ガイド

このドキュメントでは、開発における、ドキュメントの書き方・管理方法について説明します。

---

## ドキュメント体系

ドキュメント構造:

```
docs/development/
├── development-guide.md   # 開発ガイド（コーディング規約・フロー）
└── architecture/          # アーキテクチャ・設計ドキュメント
    ├── system-design.md   # システム構成図
    ├── database-design.md # データベース設計
    ├── security.md        # セキュリティ設計
    ├── deployment.md      # デプロイ戦略
    ├── types/             # 型定義ドキュメント（自動生成）
    ├── api/               # API仕様書（自動生成）
    │   └── README.md      # API設計方針・エンドポイント仕様
    ├── diagrams/          # 画面遷移図（自動生成）
    └── components/        # コンポーネントカタログ（自動生成）
```

---

## 手動作成ドキュメント

### development/（開発関連）

- **development-guide.md**: 開発方針とコーディング規約
- **architecture/system-design.md**: システム全体の構成図・アーキテクチャ
- **architecture/database-design.md**: データモデル設計の方針
- **architecture/security.md**: セキュリティ設計
- **architecture/deployment.md**: デプロイ戦略
- **architecture/api/README.md**: API設計のガイドライン・エンドポイント仕様

---

## 自動生成ドキュメント

コードから自動生成されるドキュメントです。詳細は [ドキュメント自動生成ガイド](./generation-guide.md) を参照してください。

- **types/**: TypeDocで生成される型定義ドキュメント
- **api/**: Scalar/OpenAPIで生成されるAPI仕様書（README.mdは手動作成）
- **diagrams/**: ページ遷移図（Mermaid）
- **components/**: Storybookで生成されるコンポーネントカタログ

---

## ドキュメント更新のタイミング

### 手動作成ドキュメント

| ドキュメント | 更新タイミング |
|---|---|
| development/development-guide.md | コーディング規約や開発フローが変更されたとき |
| development/architecture/*.md | 設計方針が変更されたとき |

### 自動生成ドキュメント

| ドキュメント | 更新タイミング |
|---|---|
| types/ | 型定義を追加・変更したとき |
| api/ | APIを追加・変更したとき |
| diagrams/ | ページを追加・変更したとき |
| components/ | コンポーネントを開発中（常時起動） |

詳細は [ドキュメント自動生成ガイド](./generation-guide.md) を参照。

---

## 参考資料

- [ドキュメント自動生成ガイド](./generation-guide.md)
- [ドキュメント作成ガイド（共通）](../README.md)
- [Nuxt 3 公式ドキュメント](https://nuxt.com/)
- [TypeDoc 公式ドキュメント](https://typedoc.org/)
- [Storybook for Vue](https://storybook.js.org/docs/vue/get-started/introduction)
