# コンポーネント開発ガイドライン

Vue 3 コンポーネントの開発ガイドラインについて説明します。

---

## Atomic Design に基づくコンポーネント設計

本プロジェクトでは **Atomic Design** の原則に従ってコンポーネントを設計します。

---

## ディレクトリ構成ルール

### 1. `components/common/` - 共通コンポーネント

プロジェクト全体で再利用可能なコンポーネントを配置します。

```
components/common/
├── atoms/         # 最小単位のUI要素
│   ├── button.vue
│   ├── input.vue
│   ├── icon.vue
│   └── label.vue
├── molecules/     # atoms の組み合わせ
│   ├── search-box.vue
│   ├── form-field.vue
│   └── user-avatar.vue
├── organisms/     # molecules/atoms の組み合わせ
│   ├── header.vue
│   ├── footer.vue
│   ├── user-card.vue
│   └── navigation-menu.vue
└── templates/     # ページレイアウトテンプレート
    ├── default-layout.vue
    └── auth-layout.vue
```

### 2. `components/pages/` - ページ固有のコンポーネント

特定のページでのみ使用するコンポーネントを配置します。**ディレクトリ構造は `pages/` と対応させます。**

```
pages/
├── index.vue
├── users/
│   ├── index.vue
│   └── [id].vue
└── settings/
    ├── profile.vue
    └── password.vue

components/pages/
├── index/              # pages/index.vue 用
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
│       └── hero-section.vue
├── users/              # pages/users/ 配下のページ用
│   ├── atoms/
│   ├── molecules/
│   │   └── user-filter.vue
│   └── organisms/
│       └── user-list.vue
└── settings/           # pages/settings/ 配下のページ用
    ├── profile/        # pages/settings/profile.vue 用
    │   └── organisms/
    │       └── profile-form.vue
    └── password/       # pages/settings/password.vue 用
        └── organisms/
            └── password-change-form.vue
```

**ルール:**
- `pages/` のディレクトリ構造と **1対1で対応** させる
- ページ固有のコンポーネントは該当するページディレクトリ配下に配置
- 各フォルダ内は **Atomic Design の階層（atoms/molecules/organisms/templates）** を維持
- 空のフォルダは作成しない（実際にコンポーネントが存在する階層のみ作成）

---

## コンポーネントの配置基準

どこに配置するか迷った場合は、以下の基準で判断してください。

| 配置場所 | 判断基準 | 例 |
|---------|---------|-----|
| `components/common/atoms/` | プロジェクト全体で再利用される最小UI要素 | button.vue, input.vue, icon.vue |
| `components/common/molecules/` | 複数のatomsを組み合わせた再利用可能なUI | search-box.vue, form-field.vue |
| `components/common/organisms/` | 独立した機能を持つUI群（ヘッダー、カードなど） | header.vue, user-card.vue |
| `components/common/templates/` | ページレイアウトテンプレート | default-layout.vue, auth-layout.vue |
| `components/pages/[page-name]/` | 特定のページでのみ使用するコンポーネント | hero-section.vue, user-filter.vue |

**迷った場合:**
1. まず `components/pages/` に配置
2. 他のページでも使いたくなったら `components/common/` に移動してリファクタリング

---

## コンポーネントの実装

### 基本構造

```vue
<!-- components/common/organisms/user-card.vue -->
<script setup lang="ts">
import type { User } from '~/types/user'

/**
 * ユーザーカードコンポーネント
 */
interface Props {
  /** ユーザー情報 */
  user: User
  /** クリック可能かどうか */
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false
})

interface Emits {
  /** ユーザーがクリックされた時 */
  click: [user: User]
}

const emit = defineEmits<Emits>()

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.user)
  }
}
</script>

<template>
  <div
    class="user-card"
    :class="{ 'cursor-pointer': clickable }"
    @click="handleClick"
  >
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
  </div>
</template>

<style scoped>
.user-card {
  @apply rounded-lg border p-4 shadow-sm;
}
</style>
```

### 実装ルール

#### 1. `<script setup>` を使用

```vue
<!-- ✅ 良い例 -->
<script setup lang="ts">
const count = ref(0)
</script>

<!-- ❌ 悪い例 -->
<script lang="ts">
export default {
  setup() {
    const count = ref(0)
    return { count }
  }
}
</script>
```

#### 2. Props と Emits に型を定義

```typescript
// ✅ 良い例
interface Props {
  user: User
  isEditable?: boolean
}

interface Emits {
  update: [id: string, data: Partial<User>]
  delete: [id: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ❌ 悪い例
const props = defineProps({
  user: Object,
  isEditable: Boolean
})

const emit = defineEmits(['update', 'delete'])
```

#### 3. デフォルト値は `withDefaults` を使用

```typescript
// ✅ 良い例
const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  size: 'md'
})

// ❌ 悪い例（TypeScriptでデフォルト値が型推論されない）
const props = defineProps<Props>()
```

#### 4. JSDocコメントを記述

```typescript
// ✅ 良い例
/**
 * ユーザーカードコンポーネント
 */
interface Props {
  /** ユーザー情報 */
  user: User
  /** クリック可能かどうか */
  clickable?: boolean
}

interface Emits {
  /** ユーザーがクリックされた時 */
  click: [user: User]
}
```

#### 5. ファイル名と呼び出し方

- **ファイル名**: kebab-case（例: `user-card.vue`）
- **テンプレート呼び出し**: PascalCase（例: `<CommonOrganismsUserCard>`）

```vue
<!-- ファイル: components/common/organisms/user-card.vue -->

<!-- 使用例: pages/users/index.vue -->
<template>
  <CommonOrganismsUserCard :user="user" @click="handleClick" />
</template>
```

---

## コンポーネント設計のベストプラクティス

### 1. 単一責任の原則

コンポーネントは1つの責任のみを持つべきです。

```vue
<!-- ❌ 悪い例: 複数の責任を持つ -->
<template>
  <div>
    <header>...</header>
    <nav>...</nav>
    <main>...</main>
    <footer>...</footer>
  </div>
</template>

<!-- ✅ 良い例: 責任を分割 -->
<template>
  <div>
    <CommonOrganismsHeader />
    <CommonOrganismsNavigation />
    <slot />
    <CommonOrganismsFooter />
  </div>
</template>
```

### 2. Props のバリデーション

```typescript
// ✅ 良い例: 型で制約を表現
interface Props {
  size: 'sm' | 'md' | 'lg'
  variant: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
}

// さらに厳密にする場合
const props = defineProps<Props>()

// ランタイムバリデーション（必要な場合）
if (!['sm', 'md', 'lg'].includes(props.size)) {
  console.warn(`Invalid size: ${props.size}`)
}
```

### 3. スロットの活用

```vue
<!-- コンポーネント定義 -->
<template>
  <div class="card">
    <div class="card-header">
      <slot name="header">デフォルトヘッダー</slot>
    </div>
    <div class="card-body">
      <slot>デフォルトコンテンツ</slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<!-- 使用例 -->
<template>
  <CommonAtomsCard>
    <template #header>
      <h3>カスタムヘッダー</h3>
    </template>

    <p>カードの本文</p>

    <template #footer>
      <button>アクション</button>
    </template>
  </CommonAtomsCard>
</template>
```

### 4. Composablesでロジックを分離

```vue
<!-- ❌ 悪い例: コンポーネントにロジックが集中 -->
<script setup lang="ts">
const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchUsers = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/users')
    users.value = data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>

<!-- ✅ 良い例: Composablesでロジックを分離 -->
<script setup lang="ts">
// composables/useUsers.ts で定義
const { users, loading, error, fetchUsers } = useUsers()

onMounted(fetchUsers)
</script>
```

### 5. v-model の活用

```vue
<!-- コンポーネント定義 -->
<script setup lang="ts">
interface Props {
  modelValue: string
}

const props = defineProps<Props>()

interface Emits {
  'update:modelValue': [value: string]
}

const emit = defineEmits<Emits>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input :value="modelValue" @input="updateValue" />
</template>

<!-- 使用例 -->
<template>
  <CommonAtomsInput v-model="searchQuery" />
</template>
```

---

## コンポーネントのテストと検証

コンポーネントには以下のテスト・検証を用意します:

### 作成タイミング

| 成果物 | 作成タイミング | 必須/任意 |
|--------|--------------|----------|
| **Storybook** | コンポーネント実装時（実装工程） | UIコンポーネントは必須 |
| **単体テスト** | テスト実施工程 | 必須 |

**重要**: UIコンポーネント（atoms/molecules/organisms）を作成・修正した場合は、
対応するStorybookストーリーも同時に作成・修正してください。これは**実装工程の一部**です。

### 1. 単体テスト（Vitest）

```typescript
// tests/unit/components/common/atoms/button.test.ts
import { mount } from '@vue/test-utils'
import Button from '~/components/common/atoms/button.vue'

describe('Button', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### 2. Storybook

```typescript
// components/common/atoms/button.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3'
import Button from './button.vue'

const meta = {
  title: 'Common/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">クリック</Button>',
  }),
}
```

詳細は [テストガイド](./testing-guide.md) と [Storybookガイド](./storybook-guide.md) を参照。

---

## パフォーマンス最適化

### 1. `v-once` ディレクティブ

静的コンテンツには `v-once` を使用:

```vue
<template>
  <div v-once>
    <h1>{{ staticTitle }}</h1>
    <p>この内容は変更されません</p>
  </div>
</template>
```

### 2. `v-memo` ディレクティブ

条件付きでレンダリングをスキップ:

```vue
<template>
  <div v-memo="[user.id, user.updatedAt]">
    <!-- user.id と user.updatedAt が変わらない限り再レンダリングされない -->
    <UserCard :user="user" />
  </div>
</template>
```

### 3. 動的コンポーネントの遅延ロード

```vue
<script setup lang="ts">
const HeavyComponent = defineAsyncComponent(() =>
  import('~/components/common/organisms/heavy-component.vue')
)
</script>

<template>
  <Suspense>
    <HeavyComponent />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

---

## アクセシビリティ

### 1. セマンティックHTML

```vue
<!-- ✅ 良い例 -->
<template>
  <button @click="handleClick">クリック</button>
</template>

<!-- ❌ 悪い例 -->
<template>
  <div @click="handleClick">クリック</div>
</template>
```

### 2. ARIA属性

```vue
<template>
  <button
    aria-label="メニューを開く"
    aria-expanded="false"
    @click="toggleMenu"
  >
    <IconMenu />
  </button>
</template>
```

### 3. キーボード操作

```vue
<template>
  <div
    tabindex="0"
    role="button"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    クリック可能な要素
  </div>
</template>
```

---

## よくあるコンポーネントの使い方

### Toast（通知メッセージ）コンポーネント

Toast コンポーネントは、`message` プロパティを使用してメッセージを表示します。**スロットではなく、必ず `message` プロパティを使用してください。**

```vue
<!-- ✅ 正しい使い方 -->
<template>
  <CommonMoleculesToast
    type="error"
    :message="errorMessage"
    :duration="0"
  />
</template>

<!-- ❌ 間違った使い方（スロットは使用不可） -->
<template>
  <CommonMoleculesToast type="error" :show="true" :auto-hide="false">
    {{ errorMessage }}
  </CommonMoleculesToast>
</template>
```

**Props:**
- `message` (required): 表示するメッセージ
- `type`: `'success' | 'error' | 'warning' | 'info'` (default: `'info'`)
- `title`: タイトル（オプション）
- `duration`: 自動で閉じるまでの時間（ミリ秒）。0で自動クローズなし (default: `5000`)
- `closable`: 閉じるボタンを表示するか (default: `true`)

**使用例:**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const errorMessage = ref<string | null>(null)

const handleSubmit = () => {
  try {
    // ... 処理
  } catch (error) {
    errorMessage.value = 'エラーが発生しました'
  }
}
</script>

<template>
  <div>
    <!-- エラーメッセージ表示 -->
    <div v-if="errorMessage" class="mb-6">
      <CommonMoleculesToast
        type="error"
        :message="errorMessage"
        :duration="0"
        @close="errorMessage = null"
      />
    </div>

    <!-- 成功メッセージ表示（5秒後に自動で閉じる） -->
    <CommonMoleculesToast
      type="success"
      message="保存しました"
      :duration="5000"
    />
  </div>
</template>
```

### Input（入力フィールド）コンポーネントの v-model

Input コンポーネントは `modelValue` プロパティとして `string | undefined` 型を受け取ります。

**数値入力の場合:**

```vue
<script setup lang="ts">
import { reactive } from 'vue'

interface Form {
  name: string
  age: string  // 数値でも string 型で管理
}

const form = reactive<Form>({
  name: '',
  age: ''
})

const validateForm = () => {
  // バリデーション時に数値に変換
  const age = Number(form.age)
  if (!form.age || isNaN(age) || age < 18 || age > 120) {
    return '年齢は18歳以上120歳以下で入力してください。'
  }
  return null
}
</script>

<template>
  <CommonAtomsInput
    v-model="form.age"
    label="年齢"
    type="number"
    placeholder="28"
    required
  />
</template>
```

**❌ 間違った使い方:**

```vue
<!-- v-model.number は使用しない -->
<CommonAtomsInput
  v-model.number="form.age"  <!-- ❌ 型エラー -->
  type="number"
/>
```

**理由:**
- `v-model.number` を使うと、値が `number` 型になりますが、Input コンポーネントは `string | undefined` 型のみを受け入れます
- 数値フィールドでも文字列として管理し、バリデーションやAPI送信時に `Number()` で変換してください

---

## 関連ドキュメント

- [開発ガイド トップ](../development-guide.md)
- [ディレクトリ構成](./directory-structure.md)
- [命名規則](./naming-conventions.md)
- [Nuxt 3 オートインポート](./nuxt-auto-import.md)
- [Storybookガイド](./storybook-guide.md)
- [テストガイド](./testing-guide.md)
