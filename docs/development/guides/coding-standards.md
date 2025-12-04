# コーディング規約

プロジェクト全体で統一されたコーディングスタイルについて説明します。

---

## 基本原則

1. **型安全性の重視**: TypeScript の型システムを最大限活用
2. **自動化の推進**: ドキュメント生成、テスト、デプロイを自動化
3. **コードの再利用**: Composition API と Composables で共通ロジックを抽出
4. **段階的な実装**: 小さな単位で実装し、こまめにコミット

---

## TypeScript

### 型定義

#### 型定義の配置

すべての型定義は `types/` 配下に集約します。これにより、型定義の一元管理と Mock ↔ サーバー ↔ クライアント間での型の一致を保証します。

**ディレクトリ構成:**
```
types/
├── index.ts          # すべての型をエクスポート
├── common.ts         # 共通型（ID, Timestamp, Pagination など）
├── user.ts           # User 関連
└── api.ts            # APIレスポンス型
```

#### 型定義の記述例

```typescript
// types/user.ts

import type { ID, Timestamp } from './common'

/**
 * ユーザーアカウント
 */
export interface User {
  /** ユーザーID (UUID) */
  id: ID
  /** メールアドレス */
  email: string
  /** Firebase UID */
  firebaseUid: string
  /** 作成日時 */
  createdAt: Timestamp
  /** 更新日時 */
  updatedAt: Timestamp
  /** 削除日時（論理削除） */
  deletedAt: Timestamp | null
}

/**
 * ユーザーロール
 */
export type UserRole = 'admin' | 'user' | 'guest'

/**
 * ステータス
 */
export type Status = 'active' | 'inactive' | 'pending'
```

#### 使用方法

```typescript
// 単一の型をインポート
import type { User, UserRole } from '~/types/user'

// すべての型をインポート
import type { User, UserRole, Status } from '~/types'
```

#### Mock専用の拡張型

Mock データで特殊な型が必要な場合のみ、`mocks/` 内で拡張型を定義します。

```typescript
// mocks/user.ts
import type { User } from '~/types'

/**
 * 追加情報を含むユーザー型（Mock専用）
 */
export interface MockUserWithDetails extends User {
  /** 表示名 */
  displayName: string
  /** ロール */
  role: 'admin' | 'user'
}
```

**ルール:**
- すべての型定義は `types/` 配下に配置
- export する型には必ず JSDoc コメントを記述
- インターフェースとタイプエイリアスを適切に使い分け
- オプショナルなプロパティは `?` で明示
- Mock専用の拡張型のみ `mocks/` 内で定義
- 型定義を変更した場合は `npm run docs:types` でドキュメントを再生成

### 型アノテーション

```typescript
// ✅ 良い例: 型を明示
const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

// ❌ 悪い例: 型が推論に頼りすぎ
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } })
  return user
}
```

### ジェネリック型

```typescript
// ✅ 良い例
interface ApiResponse<TData, TError = string> {
  data?: TData
  error?: TError
  status: number
}

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // ...
}

// 使用例
const response = await fetchData<User[]>('/api/users')
```

---

## 型安全性のベストプラクティス

このセクションでは、型エラーを事前に防ぐための重要なベストプラクティスを説明します。

### 1. Null安全性

#### Optional Chaining と Nullish Coalescing の使用

`null` や `undefined` の可能性がある値には、必ず Optional Chaining (`?.`) と Nullish Coalescing (`??`) を使用します。

```typescript
// ✅ 良い例: null チェック
interface Chat {
  id: string
  lastMessageAt: Date | null
}

// Optional Chaining で安全にアクセス
const timestamp = chat.lastMessageAt?.getTime() ?? 0

// 三項演算子での null チェック
const displayTime = chat.lastMessageAt
  ? formatDate(chat.lastMessageAt)
  : '未送信'

// ❌ 悪い例: null チェックなし（型エラー）
const timestamp = chat.lastMessageAt.getTime() // エラー: 'chat.lastMessageAt' is possibly 'null'
```

#### ソート処理での null 対応

配列のソート時に `null` の可能性がある値を扱う場合:

```typescript
// ✅ 良い例
const sortedChats = computed(() => {
  return [...chats.value].sort((a, b) => {
    const aTime = a.lastMessageAt?.getTime() ?? 0
    const bTime = b.lastMessageAt?.getTime() ?? 0
    return bTime - aTime
  })
})

// ❌ 悪い例
const sortedChats = computed(() => {
  return [...chats.value].sort((a, b) => {
    return b.lastMessageAt.getTime() - a.lastMessageAt.getTime() // エラー
  })
})
```

### 2. null と undefined の扱い

#### 型の互換性

`null` と `undefined` は異なる型として扱われます。プロパティの型定義に注意してください。

```typescript
// ✅ 良い例: null を undefined に変換
interface AvatarProps {
  src: string | undefined  // undefined のみを許容
}

// null を undefined に変換
<CommonAtomsAvatar :src="user.avatarUrl ?? undefined" />

// ❌ 悪い例: null をそのまま渡す（型エラー）
<CommonAtomsAvatar :src="user.avatarUrl" />  // user.avatarUrl が null の場合エラー
```

#### プロパティの型定義

```typescript
// 型定義
interface User {
  avatarUrl: string | null  // データベースから null が返る可能性
}

// コンポーネントのProps
interface AvatarProps {
  src: string | undefined   // undefined のみを許容
}

// 正しい使い方
const avatarSrc = user.avatarUrl ?? undefined
```

### 3. 型定義に基づいたモックデータ作成

モックデータを作成する際は、必ず型定義を参照し、すべての必須プロパティを含めます。

```typescript
// ✅ 良い例: 型定義を参照
import type { User } from '~/types'

const mockUser: User = {
  id: 'user-001',
  email: 'user@example.com',
  firebaseUid: 'firebase-uid-001',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,  // 必須プロパティ（型定義に含まれる）
}

// ❌ 悪い例: プロパティの不足（型エラー）
const mockUser: User = {
  id: 'user-001',
  email: 'user@example.com',
  firebaseUid: 'firebase-uid-001',
  // deletedAt が不足 → 型エラー
}

// ❌ 悪い例: 存在しないプロパティ（型エラー）
const mockUser: User = {
  id: 'user-001',
  email: 'user@example.com',
  firebaseUid: 'firebase-uid-001',
  emailVerified: true,  // User型に存在しない → 型エラー
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
}
```

#### 型定義確認の手順

1. **型定義ファイルを確認**: `types/` ディレクトリの型定義を確認
2. **必須プロパティをチェック**: `?` がないプロパティはすべて必須
3. **拡張型を確認**: `extends` している場合は親の型も確認

```typescript
// 例: User型を確認
// types/user.ts を開く
export interface User {
  id: ID
  email: string
  firebaseUid: string
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt: Timestamp | null  // null許容だが必須
}

// 共通型を確認
// types/common.ts を開く
export type ID = string
export type Timestamp = Date
```

### 4. Storybook の型安全性

Storybookのストーリーを作成する際は、必ず `args` プロパティを定義します。

```typescript
import type { Meta, StoryObj } from '@storybook/vue3'
import StarRating from './star-rating.vue'

const meta: Meta<typeof StarRating> = {
  title: 'Common/Molecules/StarRating',
  component: StarRating,
}

export default meta
type Story = StoryObj<typeof StarRating>

// ✅ 良い例: args を定義
export const Default: Story = {
  args: {
    modelValue: 4,
    maxRating: 5,
    size: 'md',
  },
}

// ✅ 良い例: カスタムレンダー関数でも args を定義
export const Comparison: Story = {
  args: {
    modelValue: 0,  // 必須プロパティ
  },
  render: () => ({
    components: { StarRating },
    template: `
      <div>
        <StarRating :model-value="5.0" readonly />
        <StarRating :model-value="4.5" readonly />
      </div>
    `,
  }),
}

// ❌ 悪い例: args がない（型エラー）
export const Comparison: Story = {
  render: () => ({
    components: { StarRating },
    template: `<StarRating :model-value="5.0" />`,
  }),
}
```

#### 必須 Props の確認

コンポーネントの Props 定義から必須プロパティを確認します:

```typescript
// コンポーネント定義
interface ModalProps {
  modelValue: boolean      // 必須（? がない）
  title: string            // 必須
  isLoading?: boolean      // オプション（? がある）
}

// Storybook での使用
export const Default: Story = {
  args: {
    modelValue: true,        // 必須なので指定
    title: 'モーダルタイトル',  // 必須なので指定
    isLoading: false,        // オプションだが明示的に指定
  },
}
```

### 5. 型チェックの習慣化

#### コミット前の型チェック

コミット前に必ず型チェックを実行します:

```bash
# 型チェック実行
pnpm run typecheck

# エラーがある場合は修正してから再実行
# すべてのエラーを解消してからコミット
```

#### 開発中の型チェック

開発中も定期的に型チェックを実行します:

```bash
# ファイル保存時に自動型チェック（VS Code）
# settings.json に追加:
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### 6. よくある型エラーと対処法

#### エラー1: 'X' is possibly 'null'

```typescript
// エラー
const time = chat.lastMessageAt.getTime()

// 解決策1: Optional Chaining
const time = chat.lastMessageAt?.getTime()

// 解決策2: 三項演算子
const time = chat.lastMessageAt ? chat.lastMessageAt.getTime() : 0

// 解決策3: Nullish Coalescing
const time = chat.lastMessageAt?.getTime() ?? 0
```

#### エラー2: Type 'null' is not assignable to type 'undefined'

```typescript
// エラー
const src: string | undefined = user.avatarUrl  // avatarUrl は string | null

// 解決策: Nullish Coalescing で変換
const src: string | undefined = user.avatarUrl ?? undefined
```

#### エラー3: Property 'X' does not exist on type 'Y'

```typescript
// エラー
const mockUser: User = {
  id: 'user-001',
  emailVerified: true,  // User型に存在しない
}

// 解決策: 型定義を確認して存在しないプロパティを削除
const mockUser: User = {
  id: 'user-001',
  // emailVerified は削除
}
```

#### エラー4: Property 'X' is missing in type 'Y'

```typescript
// エラー
const mockUser: User = {
  id: 'user-001',
  email: 'user@example.com',
  // firebaseUid, createdAt などが不足
}

// 解決策: 型定義を確認して必須プロパティを追加
const mockUser: User = {
  id: 'user-001',
  email: 'user@example.com',
  firebaseUid: 'firebase-uid-001',  // 追加
  createdAt: new Date(),            // 追加
  updatedAt: new Date(),            // 追加
  deletedAt: null,                  // 追加
}
```

### チェックリスト

実装時に以下をチェックしてください:

- [ ] `null` や `undefined` の可能性がある値に Optional Chaining (`?.`) を使用している
- [ ] `null` を `undefined` に変換が必要な場合は Nullish Coalescing (`??`) を使用している
- [ ] モックデータ作成時に型定義ファイルを参照している
- [ ] すべての必須プロパティを含めている
- [ ] 型定義に存在しないプロパティを使用していない
- [ ] Storybookストーリーに `args` プロパティを定義している
- [ ] コミット前に `pnpm run typecheck` を実行している
- [ ] 型エラーがすべて解消されていることを確認している

---

## API実装

### サーバーAPI（Nitro）

```typescript
// server/api/users/[id].get.ts
import type { User } from '~/types/user'

/**
 * ユーザー詳細取得API
 * @description 指定されたIDのユーザー情報を取得します
 */
export default defineEventHandler(async (event): Promise<User> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  return user
})
```

**ルール:**
- サーバーAPIは `server/api/` 配下に配置
- ファイル名でHTTPメソッドを指定（例: `users.get.ts`, `users.post.ts`）
- 必ず戻り値の型を明記
- JSDocでAPI仕様を記述
- エラーハンドリングは `createError` を使用

### エラーハンドリング

```typescript
// ✅ 良い例: 適切なエラーハンドリング
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // バリデーション
    if (!body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Email is required'
      })
    }

    // 処理
    const user = await createUser(body)
    return user

  } catch (error) {
    // 想定外のエラー
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to create user'
    })
  }
})
```

---

## Vue コンポーネント

### 基本構造

```vue
<script setup lang="ts">
import type { User } from '~/types/user'

/**
 * Props定義
 */
interface Props {
  /** ユーザー情報 */
  user: User
  /** 編集可能かどうか */
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

/**
 * Emits定義
 */
interface Emits {
  /** 更新イベント */
  update: [id: string, data: Partial<User>]
  /** 削除イベント */
  delete: [id: string]
}

const emit = defineEmits<Emits>()

// ロジック
const handleUpdate = (data: Partial<User>) => {
  emit('update', props.user.id, data)
}
</script>

<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <button v-if="editable" @click="handleUpdate({ name: 'New Name' })">
      編集
    </button>
  </div>
</template>

<style scoped>
.user-card {
  @apply rounded-lg border p-4;
}
</style>
```

**ルール:**
- `<script setup>` を使用
- Props と Emits に型を定義
- JSDocコメントを記述
- `withDefaults` でデフォルト値を設定

詳細は [コンポーネント開発ガイドライン](./component-guidelines.md) を参照。

---

## Composables

```typescript
// composables/useAuth.ts
import type { User } from '~/types/user'

/**
 * 認証関連のComposable
 */
export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const isLoggedIn = computed(() => !!user.value)

  /**
   * ログイン
   */
  const login = async (email: string, password: string): Promise<void> => {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    user.value = response.user
  }

  /**
   * ログアウト
   */
  const logout = async (): Promise<void> => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return {
    user: readonly(user),
    isLoggedIn,
    login,
    logout
  }
}
```

**ルール:**
- ファイル名は `use` で始める
- 共通ロジックを抽出して再利用
- 戻り値は明示的にオブジェクトで返す
- 状態は `readonly` で公開（必要に応じて）
- JSDocコメントを記述

---

## バリデーション

### Zodを使用したバリデーション

```typescript
// server/utils/validation.ts
import { z } from 'zod'

/**
 * ユーザー作成バリデーションスキーマ
 */
export const createUserSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
  name: z.string().min(1, '名前を入力してください'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

// APIでの使用例
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // バリデーション
  const result = createUserSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Validation error',
      data: result.error.issues // ⚠️ 重要: error.errors ではなく error.issues
    })
  }

  // 処理続行
  const user = await createUser(result.data)
  return user
})
```

### Zodエラーハンドリングのベストプラクティス

**重要: Zodのエラーオブジェクトは `error.issues` を使用する**

Zod 3.x 以降、エラー配列は `error.issues` プロパティに格納されています。

```typescript
// ✅ 正しい方法
try {
  schema.parse(data)
} catch (error) {
  if (error instanceof z.ZodError) {
    error.issues.forEach((issue) => {
      console.error(issue.message)
    })
  }
}

// ❌ 間違った方法（型エラーが発生）
try {
  schema.parse(data)
} catch (error) {
  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => { // error.errors は存在しない
      console.error(err.message)
    })
  }
}
```

#### フォームバリデーションでの使用例

```typescript
// pages/login.vue
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
})

const validateForm = (): boolean => {
  try {
    loginSchema.parse({ email: email.value, password: password.value })
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      // ✅ issues を使用
      error.issues.forEach((issue) => {
        if (issue.path[0] === 'email') {
          emailError.value = issue.message
        } else if (issue.path[0] === 'password') {
          passwordError.value = issue.message
        }
      })
    }
    return false
  }
}
```

#### enum バリデーションの正しい書き方

```typescript
// ✅ 正しい方法: message オプションを使用
const schema = z.object({
  gender: z.enum(['male', 'female', 'other'], {
    message: '性別を選択してください'
  }),
})

// ❌ 間違った方法: errorMap は存在しない
const schema = z.object({
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: '性別を選択してください' }) // エラー
  }),
})
```

---

## JSDocコメント

### 関数

```typescript
/**
 * 日付をYYYY-MM-DD形式でフォーマットする
 * @param date - フォーマット対象の日付
 * @returns YYYY-MM-DD形式の文字列
 * @throws {Error} 無効な日付の場合
 * @example
 * ```typescript
 * formatDate(new Date('2025-01-15')) // '2025-01-15'
 * ```
 */
export function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }
  return date.toISOString().split('T')[0]
}
```

### 型定義

```typescript
/**
 * ユーザー情報
 */
export interface User {
  /** ユーザーID（UUID） */
  id: string
  /** ユーザー名（表示名） */
  name: string
  /** メールアドレス（ユニーク） */
  email: string
  /** プロフィール画像URL（オプション） */
  avatarUrl?: string
  /** アカウント作成日時 */
  createdAt: Date
}
```

---

## コードスタイル

### インデント

- **スペース2つ**を使用
- タブは使用しない

### セミコロン

- **セミコロンを使用しない**（Prettierの設定に従う）

### クォート

- **シングルクォート**を使用
- テンプレートリテラルは必要な場合のみ

```typescript
// ✅ 良い例
const name = 'John Doe'
const message = `Hello, ${name}!`

// ❌ 悪い例
const name = "John Doe"
const message = "Hello, " + name + "!"
```

### 改行

- 関数・メソッドの間は1行空ける
- ロジックのブロック間は1行空ける

```typescript
// ✅ 良い例
const fetchUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

const updateUser = async (id: string, data: Partial<User>) => {
  return await prisma.user.update({
    where: { id },
    data
  })
}
```

---

## ESLint・Prettier

### 自動フォーマット

```bash
# Lint チェック
pnpm lint

# 自動修正
pnpm lint:fix

# Prettier でフォーマット
pnpm format
```

### エディタ設定

**VS Code** (`settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue"
  ]
}
```

---

## 関連ドキュメント

- [開発ガイド トップ](../development-guide.md)
- [命名規則](./naming-conventions.md)
- [Nuxt 3 オートインポート](./nuxt-auto-import.md)
- [コンポーネント開発ガイドライン](./component-guidelines.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
