# 命名規則

プロジェクト全体で統一された命名規則について説明します。

---

## ファイル名

### コンポーネント
- **形式**: kebab-case（ケバブケース）
- **例**: `user-card.vue`, `search-box.vue`, `button.vue`

### Composables
- **形式**: camelCase（キャメルケース）
- **プレフィックス**: `use` で始める
- **例**: `useAuth.ts`, `useUser.ts`, `useMatchingList.ts`

### ページ
- **形式**: kebab-case（ケバブケース）
- **例**: `user-profile.vue`, `[id].vue`, `index.vue`

### 型定義
- **形式**: camelCase（キャメルケース）
- **例**: `user.ts`, `match.ts`, `message.ts`

### API
- **形式**: kebab-case + HTTPメソッド
- **例**: `users.get.ts`, `users.post.ts`, `[id].get.ts`

### ユーティリティ関数
- **形式**: camelCase（キャメルケース）
- **例**: `format.ts`, `validation.ts`, `dateUtils.ts`

### テストファイル
- **形式**: `{対象ファイル名}.test.ts` または `{対象ファイル名}.spec.ts`
- **例**: `button.test.ts`, `useAuth.test.ts`, `format.spec.ts`

### Storybookストーリー
- **形式**: `{対象ファイル名}.stories.ts`
- **例**: `button.stories.ts`, `user-card.stories.ts`

---

## 変数・関数名

### 変数
- **形式**: camelCase（キャメルケース）
- **例**: `userName`, `userId`, `isLoggedIn`

```typescript
// ✅ 良い例
const userName = 'John Doe'
const isActive = true
const matchCount = 10

// ❌ 悪い例
const UserName = 'John Doe'
const is_active = true
const match_count = 10
```

### 定数
- **形式**: UPPER_SNAKE_CASE（アッパースネークケース）
- **例**: `MAX_RETRY_COUNT`, `API_BASE_URL`, `DEFAULT_PAGE_SIZE`

```typescript
// ✅ 良い例
const MAX_RETRY_COUNT = 3
const API_TIMEOUT_MS = 5000
const DEFAULT_AVATAR_URL = '/images/default-avatar.png'

// ❌ 悪い例
const maxRetryCount = 3
const apiTimeoutMs = 5000
```

### 関数
- **形式**: camelCase（キャメルケース）
- **動詞で始める**: `get`, `set`, `create`, `update`, `delete`, `fetch`, `handle` など

```typescript
// ✅ 良い例
function getUserById(id: string) { ... }
function createMatch(data: MatchData) { ... }
function handleSubmit() { ... }
function formatDate(date: Date) { ... }

// ❌ 悪い例
function user(id: string) { ... }
function match(data: MatchData) { ... }
function submit() { ... }
function date(date: Date) { ... }
```

### Boolean変数・関数
- **形式**: `is`, `has`, `should`, `can` などのプレフィックスを使用

```typescript
// ✅ 良い例
const isLoggedIn = true
const hasPermission = false
const shouldUpdate = true
const canDelete = false

function isValidEmail(email: string): boolean { ... }
function hasAccess(userId: string): boolean { ... }

// ❌ 悪い例
const loggedIn = true
const permission = false
function validEmail(email: string): boolean { ... }
```

---

## 型・インターフェース名

### インターフェース・型
- **形式**: PascalCase（パスカルケース）
- **例**: `User`, `UserProfile`, `MatchRequest`, `MessageData`

```typescript
// ✅ 良い例
interface User {
  id: string
  name: string
}

type MatchStatus = 'pending' | 'accepted' | 'rejected'

interface ApiResponse<T> {
  data: T
  error?: string
}

// ❌ 悪い例
interface user { ... }
type matchStatus = 'pending' | 'accepted'
interface apiResponse<T> { ... }
```

### Props・Emits型
- **Props**: `Props` または `{ComponentName}Props`
- **Emits**: `Emits` または `{ComponentName}Emits`

```typescript
// ✅ 良い例
interface Props {
  user: User
  isEditable?: boolean
}

interface UserCardProps {
  user: User
  clickable?: boolean
}

interface Emits {
  click: [user: User]
  update: [id: string, data: Partial<User>]
}
```

### ジェネリック型パラメータ
- **1文字**: `T`, `U`, `V` など（シンプルな場合）
- **説明的**: `TData`, `TResponse`, `TItem` など（複雑な場合）

```typescript
// ✅ 良い例
function identity<T>(value: T): T { ... }

interface ApiResponse<TData, TError = string> {
  data?: TData
  error?: TError
}

// ❌ 悪い例
function identity<type>(value: type): type { ... }
interface ApiResponse<data, error = string> { ... }
```

---

## コンポーネント名

### ファイル名とテンプレート呼び出し

- **ファイル名**: kebab-case
- **テンプレート**: PascalCase
- **ディレクトリ構造を含む**: ディレクトリ名もPascalCaseで連結

```vue
<!-- ファイル: components/common/atoms/button.vue -->
<template>
  <CommonAtomsButton>Click me</CommonAtomsButton>
</template>

<!-- ファイル: components/pages/users/organisms/user-list.vue -->
<template>
  <PagesUsersOrganismsUserList :users="users" />
</template>
```

### コンポーネント内での名前定義

```vue
<script setup lang="ts">
// ✅ defineOptions で名前を定義（オプション）
defineOptions({
  name: 'UserCard'
})
</script>
```

---

## CSS クラス名

### BEM記法を推奨

- **Block**: コンポーネント名（kebab-case）
- **Element**: `__` で連結
- **Modifier**: `--` で連結

```vue
<template>
  <div class="user-card">
    <div class="user-card__header">
      <h3 class="user-card__title">{{ user.name }}</h3>
    </div>
    <div class="user-card__body user-card__body--highlighted">
      <p class="user-card__description">{{ user.bio }}</p>
    </div>
  </div>
</template>
```

### Tailwind CSSを使用する場合

- BEM記法は不要
- ユーティリティクラスを直接使用

```vue
<template>
  <div class="rounded-lg border p-4 shadow-sm">
    <div class="mb-2">
      <h3 class="text-lg font-semibold">{{ user.name }}</h3>
    </div>
    <div class="text-gray-600">
      <p>{{ user.bio }}</p>
    </div>
  </div>
</template>
```

---

## データベース（Prisma）

### モデル名
- **形式**: PascalCase（単数形）
- **例**: `User`, `Match`, `Message`, `Review`

### フィールド名
- **形式**: camelCase
- **例**: `userId`, `createdAt`, `isActive`

```prisma
// ✅ 良い例
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Match {
  id           String      @id @default(cuid())
  requesterId  String
  recipientId  String
  status       MatchStatus
  createdAt    DateTime    @default(now())
}
```

---

## API エンドポイント

### パス
- **形式**: kebab-case
- **リソース**: 複数形を使用
- **例**: `/api/users`, `/api/items`, `/api/messages`

```
GET    /api/users          # ユーザー一覧取得
GET    /api/users/:id      # ユーザー詳細取得
POST   /api/users          # ユーザー作成
PUT    /api/users/:id      # ユーザー更新
DELETE /api/users/:id      # ユーザー削除

GET    /api/items          # アイテム一覧取得
POST   /api/items          # アイテム作成
PUT    /api/items/:id      # アイテム更新
```

---

## 環境変数

### 形式
- **形式**: UPPER_SNAKE_CASE
- **プレフィックス**: 用途に応じて
  - `DATABASE_*`: データベース関連
  - `API_*`: API関連
  - `NUXT_PUBLIC_*`: クライアント側で使用可能

```bash
# ✅ 良い例
DATABASE_URL="postgresql://..."
API_BASE_URL="https://api.example.com"
NUXT_PUBLIC_APP_NAME="MyApp"
REDIS_HOST="localhost"
REDIS_PORT="6379"

# ❌ 悪い例
databaseUrl="postgresql://..."
api-base-url="https://api.example.com"
```

---

## Git ブランチ名

### 形式
- **形式**: `<type>/<description>`
- **description**: kebab-case

```bash
# ✅ 良い例
feature/user-authentication
fix/login-redirect-bug
refactor/api-error-handling
docs/update-readme

# ❌ 悪い例
feature/UserAuthentication
fix/login_redirect_bug
refactorApiErrorHandling
```

---

## まとめ

| 対象 | 形式 | 例 |
|------|------|-----|
| ファイル（コンポーネント） | kebab-case | `user-card.vue` |
| ファイル（Composables） | camelCase | `useAuth.ts` |
| ファイル（API） | kebab-case + メソッド | `users.get.ts` |
| 変数 | camelCase | `userName` |
| 定数 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 関数 | camelCase | `getUserById()` |
| 型・インターフェース | PascalCase | `User`, `ApiResponse<T>` |
| コンポーネント（テンプレート） | PascalCase | `<CommonAtomsButton>` |
| CSS クラス（BEM） | kebab-case | `user-card__header` |
| データベースモデル | PascalCase | `User`, `Match` |
| データベースフィールド | camelCase | `userId`, `createdAt` |
| API パス | kebab-case | `/api/users` |
| 環境変数 | UPPER_SNAKE_CASE | `DATABASE_URL` |
| Git ブランチ | type/kebab-case | `feature/user-auth` |

---

## 関連ドキュメント

- [開発ガイド トップ](../development-guide.md)
- [コーディング規約](./coding-standards.md)
- [Nuxt 3 オートインポート](./nuxt-auto-import.md)
