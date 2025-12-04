# ディレクトリ構成

プロジェクトのディレクトリ構成について説明します。

---

## 全体構成

```
project-root/
├── types/              # TypeScript型定義
├── server/             # サーバーサイドAPI
│   ├── api/           # APIエンドポイント
│   ├── middleware/    # サーバーミドルウェア
│   └── utils/         # サーバーユーティリティ
├── pages/             # ページコンポーネント（ファイルベースルーティング）
├── components/        # 再利用可能なコンポーネント
│   ├── common/        # 共通コンポーネント（Atomic Design）
│   │   ├── atoms/     # 最小単位のUI要素（Button, Input など）
│   │   ├── molecules/ # atoms の組み合わせ（SearchBox, FormField など）
│   │   ├── organisms/ # molecules/atoms の組み合わせ（Header, UserCard など）
│   │   └── templates/ # ページレイアウトテンプレート
│   └── pages/         # ページ固有のコンポーネント
│       └── [page-name]/  # pages/ のルーティングと対応するフォルダ
│           ├── atoms/
│           ├── molecules/
│           ├── organisms/
│           └── templates/
├── composables/       # Composition API関数
├── stores/            # Pinia状態管理
├── utils/             # クライアントユーティリティ関数
├── assets/            # スタイルシート・画像
├── public/            # 静的ファイル
├── prisma/            # Prismaスキーマとマイグレーション
├── tests/             # テストファイル
├── docs/              # ドキュメント
│   ├── docs-guide/           # ドキュメント作成ガイド
│   └── development/          # 開発関連ドキュメント
│       ├── development-guide.md  # 開発ガイド トップ
│       ├── guides/           # 各種ガイドライン（本ドキュメント含む）
│       └── architecture/     # アーキテクチャ・設計ドキュメント
└── scripts/           # ビルド・ドキュメント生成スクリプト
```

---

## 各ディレクトリの詳細

### `types/` - 型定義
- すべてのTypeScript型定義を配置
- プロジェクト全体で使用する型を一元管理
- export する型には必ず JSDoc コメントを記述

### `server/` - サーバーサイド
- `api/`: APIエンドポイント（Nitro API）
- `middleware/`: サーバーミドルウェア
- `utils/`: サーバー専用のユーティリティ関数

### `pages/` - ページ
- Nuxt 3のファイルベースルーティング
- ルーティングパスとファイル構造が対応

### `components/` - コンポーネント
#### `components/common/` - 共通コンポーネント
プロジェクト全体で再利用可能なコンポーネント（Atomic Design）

#### `components/pages/` - ページ固有のコンポーネント
特定のページでのみ使用するコンポーネント
**ディレクトリ構造は `pages/` と対応させます。**

詳細は [コンポーネント開発ガイドライン](./component-guidelines.md) を参照。

### `composables/` - Composables
- Vue 3 Composition APIを使用した再利用可能なロジック
- `use` で始まるファイル名

### `stores/` - 状態管理
- Piniaストアを配置
- グローバルな状態管理

### `utils/` - ユーティリティ関数
- クライアント側で使用するユーティリティ関数
- オートインポート対象

### `assets/` - アセット
- スタイルシート（CSS, SCSS）
- 画像（ビルド時に最適化される）

### `public/` - 静的ファイル
- ビルド時にそのままコピーされる静的ファイル
- favicon、robots.txt など

### `prisma/` - データベース
- Prismaスキーマ定義
- マイグレーションファイル
- シードデータ

### `tests/` - テスト
テストファイルの配置ルールは [テストガイド](./testing-guide.md) を参照。

### `docs/` - ドキュメント
- プロジェクトのドキュメント
- 設計書、ガイドラインなど

### `scripts/` - スクリプト
- ビルドスクリプト
- ドキュメント生成スクリプト
- その他自動化スクリプト

---

## 関連ドキュメント

- [開発ガイド トップ](../development-guide.md)
- [コンポーネント開発ガイドライン](./component-guidelines.md)
- [テストガイド](./testing-guide.md)
