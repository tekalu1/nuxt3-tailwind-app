# Storybookガイド

Storybookはコンポーネントの開発とドキュメント化に使用します。

---

## Storybookとは

Storybookは独立した開発環境で、コンポーネントを以下の目的で使用します:

- **コンポーネント開発**: 独立した環境でUIコンポーネントを開発
- **ビジュアルテスト**: 様々な状態のコンポーネントを視覚的に確認
- **ドキュメント**: コンポーネントの使用方法を自動ドキュメント化
- **デザインレビュー**: デザイナーとの協業ツール

---

## Storybook作成のタイミング

Storybookストーリーは**実装工程の一部**として、コンポーネントと同時に作成します。

### 作成が必要なケース

| コンポーネント種別 | Storybook作成 |
|------------------|--------------|
| atoms（ボタン、入力など） | **必須** |
| molecules（カード、フォームフィールドなど） | **必須** |
| organisms（ヘッダー、サイドバーなど） | **必須** |
| templates（レイアウトテンプレート） | 任意 |
| pages/配下のページ固有コンポーネント | **必須** |

### 開発プロセスにおける位置付け

```
計画作成 → 要件定義 → テストシナリオ作成 → テスト実施 → 実装
                                                      ↓
                                              ┌──────────────┐
                                              │ 実装工程     │
                                              │ ├── コンポーネント作成 │
                                              │ └── Storybook作成 │ ← ここ
                                              └──────────────┘
```

### ルール

1. **UIコンポーネントを新規作成したら、同時にStorybookストーリーも作成する**
2. **UIコンポーネントを修正したら、対応するStorybookストーリーも更新する**
3. ストーリーファイルはコンポーネントと同じディレクトリに配置する

---

## 重要: Storybook環境での注意点

**Storybookは独立した開発環境のため、Nuxt 3のオートインポートが機能しません。**

そのため、以下のルールに従ってください。

### Vue APIは明示的にインポート

```typescript
// ❌ 誤り: オートインポートに依存（Storybookでエラー）
<script setup lang="ts">
const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

// ✅ 正しい: 明示的にインポート（Storybookで動作）
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

**明示的にインポートが必要なVue API:**
- `ref`, `computed`, `reactive`, `readonly`
- `watch`, `watchEffect`
- `onMounted`, `onUnmounted`, `onBeforeMount` など
- `nextTick`, `toRef`, `toRefs` など

### Nuxt Composablesも明示的にインポート（必要な場合）

```typescript
// ✅ Nuxt Composablesを使う場合
<script setup lang="ts">
import { useRoute, useRouter, navigateTo } from '#app'
import { useFetch } from '#app'
</script>
```

**注意:** Storybookではルーティングやデータフェッチングは基本的に使用しません。
コンポーネントはモックデータで動作するように設計してください。

### 型定義は常に `import type` を使用

```typescript
// ✅ 型のみをインポート
<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '~/types/user'

interface Props {
  user: User
}
</script>
```

---

## ストーリーファイルの作成

コンポーネントごとに `.stories.ts` ファイルを作成します。

### 命名規則

- **ファイル名**: `{component-name}.stories.ts`（kebab-case）
- **配置場所**: コンポーネントと同じディレクトリ

**例:**
```
components/common/atoms/
├── button.vue
└── button.stories.ts
```

### 基本的なストーリーファイル

```typescript
// components/common/atoms/button.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3'
import Button from './button.vue'

const meta = {
  title: 'Common/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'ボタンのバリアント',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'ボタンのサイズ',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
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

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">セカンダリ</Button>',
  }),
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">無効</Button>',
  }),
}
```

### ストーリーのカテゴリ構造

```
title: 'Common/Atoms/Button'      → Common → Atoms → Button
title: 'Common/Molecules/Card'    → Common → Molecules → Card
title: 'Pages/Users/UserList'     → Pages → Users → UserList
```

---

## モックデータの使用

Storybookではモックデータを使用してコンポーネントを表示します。

### モックデータファイル

```typescript
// mocks/user.ts
export const mockUsers: User[] = [
  {
    id: '1',
    name: '山田太郎',
    email: 'yamada@example.com',
    avatarUrl: '/avatars/user1.png',
    age: 28,
  },
  {
    id: '2',
    name: '佐藤花子',
    email: 'sato@example.com',
    avatarUrl: '/avatars/user2.png',
    age: 25,
  },
]

export const getMockUserById = (id: string) => {
  return mockUsers.find(user => user.id === id)
}
```

### ストーリーでモックデータを使用

```typescript
// components/common/organisms/user-card.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3'
import UserCard from './user-card.vue'
import { mockUsers } from '~/mocks/user'

const meta = {
  title: 'Common/Organisms/UserCard',
  component: UserCard,
  tags: ['autodocs'],
} satisfies Meta<typeof UserCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    user: mockUsers[0],
  },
}

export const WithLongName: Story = {
  args: {
    user: {
      ...mockUsers[0],
      name: 'とても長い名前のユーザーさん',
    },
  },
}
```

---

## インタラクティブなストーリー

ユーザーの操作を含むストーリーを作成できます。

### ⚠️ 重要: render関数を使用する場合は args を必ず定義

Storybook 8.x では、`render` 関数を使用するストーリーでも `args` プロパティが必須です。

```typescript
// ✅ 正しい方法: args を定義
export const Interactive: Story = {
  args: {
    steps: [
      { number: 1, label: 'ステップ1' },
      { number: 2, label: 'ステップ2' },
      { number: 3, label: 'ステップ3' },
    ],
    currentStep: 1,
  },
  render: (args) => ({
    components: { StepIndicator },
    setup() {
      const currentStep = ref(1)
      const steps = [
        { number: 1, label: 'ステップ1' },
        { number: 2, label: 'ステップ2' },
        { number: 3, label: 'ステップ3' },
      ]
      return { currentStep, steps }
    },
    template: '<StepIndicator :steps="steps" :current-step="currentStep" />',
  }),
}

// ❌ 間違った方法: args がない（型エラー発生）
export const Interactive: Story = {
  render: (args) => ({
    // args が定義されていないため、TypeScriptエラーが発生
    components: { StepIndicator },
    setup() {
      // ...
    },
    template: '<StepIndicator :steps="steps" :current-step="currentStep" />',
  }),
}
```

### クリックイベントのテスト

```typescript
export const Clickable: Story = {
  args: {
    user: mockUsers[0],
    clickable: true,
  },
  render: (args) => ({
    components: { UserCard },
    setup() {
      const handleClick = (user: User) => {
        alert(`${user.name} がクリックされました`)
      }
      return { args, handleClick }
    },
    template: '<UserCard v-bind="args" @click="handleClick" />',
  }),
}
```

### 複数の状態を表示

```typescript
export const AllVariants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    `,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 1rem; align-items: center;">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    `,
  }),
}
```

---

## Storybookの起動とビルド

### 開発サーバー起動

```bash
pnpm run storybook
```

ブラウザで `http://localhost:6006` を開きます。

### ビルド（静的ファイル生成）

```bash
pnpm run build-storybook
```

**生成物:** `storybook-static/`（.gitignoreに追加済み）

---

## Tailwind CSSの利用

Storybook環境でTailwind CSSを使用するための設定は `.storybook/preview.ts` で行います。

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/vue3'
import '../assets/css/main.css' // Tailwind CSS

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
```

---

## トラブルシューティング

### エラー: `computed is not defined`

**原因**: Vue APIが明示的にインポートされていない

**解決策**: `import { computed } from 'vue'` を追加

```typescript
// ❌ エラーが発生
<script setup lang="ts">
const doubled = computed(() => count.value * 2)
</script>

// ✅ 修正後
<script setup lang="ts">
import { computed } from 'vue'
const doubled = computed(() => count.value * 2)
</script>
```

### Tailwind CSSが反映されない

**原因**: `.storybook/preview.ts` でCSSがインポートされていない

**解決策**: `import '../assets/css/main.css'` を追加

### コンポーネントが見つからない

**原因**: `.storybook/main.ts` のストーリーパスが正しくない

**解決策**: `stories` 配列のパスを確認

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  // ...
}
```

### FontAwesomeアイコンが表示されない

**原因**: Storybook環境でFontAwesomeが初期化されていない

**解決策**: `.storybook/preview.ts` でFontAwesomeをインポート

```typescript
// .storybook/preview.ts
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { setup } from '@storybook/vue3'

library.add(fas, far, fab)

setup((app) => {
  app.component('FontAwesomeIcon', FontAwesomeIcon)
})
```

---

## ストーリー作成のベストプラクティス

### 1. すべての状態をカバーする

```typescript
export const Default: Story = { ... }
export const Loading: Story = { ... }
export const Error: Story = { ... }
export const Empty: Story = { ... }
export const Disabled: Story = { ... }
```

### 2. エッジケースをテストする

```typescript
export const LongText: Story = {
  args: {
    text: 'とても長いテキストが入力された場合の表示確認用ストーリーです。'.repeat(10)
  }
}

export const EmptyData: Story = {
  args: {
    items: []
  }
}
```

### 3. わかりやすいストーリー名

```typescript
// ✅ 良い例
export const Primary: Story = { ... }
export const WithIcon: Story = { ... }
export const DisabledState: Story = { ... }

// ❌ 悪い例
export const Story1: Story = { ... }
export const Test: Story = { ... }
```

### 4. ドキュメントを追加

```typescript
const meta = {
  title: 'Common/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'プロジェクト全体で使用する基本的なボタンコンポーネントです。',
      },
    },
  },
} satisfies Meta<typeof Button>

export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'プライマリアクション用のボタンです。',
      },
    },
  },
}
```

---

## 関連ドキュメント

- [開発ガイド トップ](../development-guide.md)
- [コンポーネント開発ガイドライン](./component-guidelines.md)
- [Nuxt 3 オートインポート](./nuxt-auto-import.md)
- [Storybook 公式ドキュメント](https://storybook.js.org/)
