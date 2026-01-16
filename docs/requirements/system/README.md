# システム要件

プロジェクト固有のシステムアーキテクチャ・技術要件を定義します。

---

## 概要

本アプリケーションは、Nuxt 3 + Tailwind CSS + Pinia を基盤としたモダンなWebアプリケーションテンプレートです。
スケーラブルで保守性の高いフロントエンド開発のベストプラクティスを提供します。

### 設計原則

```
┌─────────────────────────────────────────────────────────────┐
│                     アプリケーション層                        │
│  ・ページ/レイアウト                                          │
│  ・UIコンポーネント（Atomic Design）                          │
│  ・状態管理（Pinia Stores）                                  │
│  ・API通信                                                   │
└─────────────────────────────────────────────────────────────┘
         ↑           ↑           ↑           ↑
    ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐
    │ Pages   │ │Components│ │ Stores  │ │Composables│
    │(ページ) │ │(UI部品) │ │(状態管理)│ │(ロジック)│
    └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

**重要**: 各レイヤーは明確な責務を持ち、単方向のデータフローを維持します。これにより：

- 予測可能な状態管理
- 再利用可能なコンポーネント設計
- テスト容易性の確保

---

## ドキュメント構成

| ファイル | 内容 |
|---------|------|
| [types.md](./types.md) | 共通型定義（Entity, Response, Request） |
| [api-design.md](./api-design.md) | API設計（RESTエンドポイント） |
| [database.md](./database.md) | データベース設計 |

> **Note**: 上記ファイルはプロジェクトの要件に応じて作成してください。

---

## 技術スタック

| レイヤー | 技術 | 備考 |
|---------|------|------|
| フレームワーク | Nuxt 3 | Vue 3 ベースのフルスタックフレームワーク |
| スタイリング | Tailwind CSS | ユーティリティファーストCSS |
| 状態管理 | Pinia | Vue 3 公式推奨の状態管理 |
| バックエンド | Nuxt Server Routes (Nitro) | APIエンドポイント |
| 型システム | TypeScript | 静的型付け |
| テスト | Vitest / Playwright | ユニット/E2Eテスト |

---

## プロジェクト固有の型定義

プロジェクトで共通に使用する型は `types/` ディレクトリに配置します。

```typescript
// types/user.ts - ユーザー関連の型定義例
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'member' | 'guest'

// types/api.ts - API関連の型定義例
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
```

---

## 関連ドキュメント

- [機能要件](../features/README.md) - 画面・機能単位の要件
- [汎用アーキテクチャ](../../development/architecture/system-design.md) - Nuxt3/Nitro等の汎用設計
- [開発ガイド](../../development/development-guide.md) - 開発プロセス
