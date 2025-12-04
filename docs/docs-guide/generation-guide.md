# ドキュメント自動生成ガイド

本プロジェクトは**コードファースト開発**を採用しており、実装したコードから各種ドキュメントを自動生成します。
このガイドでは、ドキュメント自動生成の仕組みとセットアップ方法を説明します。

---

## 自動生成されるドキュメント

| ドキュメント種類 | ツール | 生成元 | 出力先 |
|---|---|---|---|
| 型定義ドキュメント | TypeDoc | `types/` | `docs/development/architecture/types/` |
| API仕様書 | Scalar/OpenAPI | `server/api/` | `docs/development/architecture/api/` |
| 画面遷移図 | Mermaid | `pages/` | `docs/development/architecture/diagrams/` |
| コンポーネントカタログ | Storybook | `components/` | `docs/development/architecture/components/` |

---

## 1. 型定義ドキュメント (TypeDoc)

### セットアップ

```bash
npm install -D typedoc typedoc-plugin-markdown
```

`typedoc.json` を作成:

```json
{
  "entryPoints": ["./types"],
  "out": "docs/development/architecture/types",
  "plugin": ["typedoc-plugin-markdown"],
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeExternals": true,
  "readme": "none"
}
```

### 実装方法

`types/` 配下にTypeScript型定義を記述します。

```typescript
// types/user.ts
/**
 * ユーザー情報
 */
export interface User {
  /** ユーザーID */
  id: string
  /** ユーザー名 */
  name: string
  /** メールアドレス */
  email: string
  /** プロフィール */
  profile: UserProfile
  /** 作成日時 */
  createdAt: Date
  /** 更新日時 */
  updatedAt: Date
}

/**
 * ユーザープロフィール情報
 */
export interface UserProfile {
  /** 年齢 */
  age: number
  /** 性別 */
  gender: 'male' | 'female' | 'other'
  /** 好きなお酒の種類 */
  favoriteAlcohol: AlcoholType[]
  /** 自己紹介 */
  bio: string
}

/**
 * お酒の種類
 */
export type AlcoholType = 'beer' | 'sake' | 'wine' | 'whiskey' | 'cocktail' | 'shochu'
```

### ドキュメント生成

```bash
npm run docs:types
```

生成先: `docs/development/architecture/types/`

---

## 2. API仕様書 (Swagger/OpenAPI)

### セットアップ

```bash
npm install -D @scalar/nuxt
```

`nuxt.config.ts` に追加:

```typescript
export default defineNuxtConfig({
  modules: ['@scalar/nuxt'],
  scalar: {
    spec: {
      url: '/api/_openapi.json'
    }
  },
  nitro: {
    experimental: {
      openAPI: true
    }
  }
})
```

### 実装方法

`server/api/` 配下のAPIハンドラーに型定義とJSDocを記述します。

```typescript
// server/api/users/index.get.ts
import type { User } from '~/types/user'

/**
 * ユーザー一覧取得API
 * @description 登録されている全ユーザーを取得します
 */
export default defineEventHandler(async (): Promise<User[]> => {
  // 実装
})
```

### ドキュメント生成

```bash
npm run docs:api
```

生成先: `docs/development/architecture/api/`

---

## 3. 画面遷移図 (Mermaid)

### セットアップ

カスタムスクリプトで `pages/` 配下を解析し、Mermaid記法で画面遷移図を生成します。

```bash
npm install -D gray-matter globby
```

### 実装方法

各ページコンポーネントにメタ情報を記述します。

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
definePageMeta({
  title: 'ホーム',
  transitions: ['login', 'profile', 'matching']
})
</script>
```

### ドキュメント生成スクリプト

`scripts/generate-flow-diagram.js`:

```javascript
import { writeFileSync, readFileSync, mkdirSync } from 'fs'
import { globby } from 'globby'

async function generateFlowDiagram() {
  const pageFiles = await globby(['pages/**/*.vue'])

  let mermaid = 'graph TD\n'

  // Vueファイルをパースして画面遷移を抽出
  for (const file of pageFiles) {
    const content = readFileSync(file, 'utf-8')
    // NuxtLink や navigateTo を検出
    // TODO: 実装
  }

  const output = `# 画面遷移図

\`\`\`mermaid
${mermaid}
\`\`\`
`

  mkdirSync('docs/development/architecture/diagrams', { recursive: true })
  writeFileSync('docs/development/architecture/diagrams/page-flow.md', output)
  console.log('✓ Page flow diagram generated')
}

generateFlowDiagram()
```

### ドキュメント生成

```bash
npm run docs:flow
```

生成先: `docs/development/architecture/diagrams/page-flow.md`

---

## 4. コンポーネントカタログ (Storybook)

### セットアップ

```bash
npx storybook-nuxt init
```

### 実装方法

コンポーネントと同じディレクトリに `.stories.ts` ファイルを作成します。

```typescript
// components/UserCard.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3'
import UserCard from './UserCard.vue'

const meta: Meta<typeof UserCard> = {
  title: 'Components/UserCard',
  component: UserCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof UserCard>

export const Default: Story = {
  args: {
    user: {
      id: '1',
      name: '山田太郎',
      age: 28,
      favoriteAlcohol: ['beer', 'sake']
    }
  }
}
```

### 起動

```bash
npm run storybook
```

アクセス: `http://localhost:6006`

### ビルド

```bash
npm run build-storybook
```

ビルド出力先: `docs/development/architecture/components/`

---

## NPMスクリプト

`package.json` にドキュメント生成用のスクリプトを定義します。

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build -o docs/development/architecture/components",
    "docs:types": "typedoc",
    "docs:api": "node scripts/generate-api-docs.js",
    "docs:flow": "node scripts/generate-flow-diagram.js",
    "docs:generate": "npm run docs:types && npm run docs:api && npm run docs:flow"
  }
}
```

---

## ドキュメント生成フロー

### 開発中

```bash
# Storybookを起動（開発中は常時起動推奨）
npm run storybook
```

### 実装完了後

```bash
# すべてのドキュメントを一括生成
npm run docs:generate
```

### 個別生成

```bash
# 型定義ドキュメントのみ
npm run docs:types

# API仕様書のみ
npm run docs:api

# 画面遷移図のみ
npm run docs:flow

# コンポーネントカタログのみ
npm run build-storybook
```

---

## ドキュメント更新タイミング

| 変更内容 | 実行コマンド | タイミング |
|---|---|---|
| 型定義を追加・変更 | `npm run docs:types` | 実装完了後 |
| APIを追加・変更 | `npm run docs:api` | 実装完了後 |
| ページを追加・変更 | `npm run docs:flow` | 実装完了後 |
| コンポーネントを開発 | `npm run storybook` | 開発中は常時起動 |
| すべて一括更新 | `npm run docs:generate` | PR作成前 |

---

## トラブルシューティング

### TypeDocのビルドエラー

```bash
# node_modulesの型定義を除外
typedoc --excludeExternals
```

### Storybookが起動しない

```bash
# キャッシュをクリア
rm -rf node_modules/.cache/storybook
npm run storybook
```

### API仕様書が生成されない

`nuxt.config.ts` で OpenAPI が有効化されているか確認:

```typescript
nitro: {
  experimental: {
    openAPI: true
  }
}
```

---

## 参考資料

- [TypeDoc 公式ドキュメント](https://typedoc.org/)
- [Storybook for Vue](https://storybook.js.org/docs/vue/get-started/introduction)
- [Scalar API Reference](https://github.com/scalar/scalar)
- [Mermaid 記法](https://mermaid.js.org/)
- [Nuxt Nitro OpenAPI](https://nitro.unjs.io/guide/openapi)
