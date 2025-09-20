# プロジェクト規約

## Nuxt 3 オートインポート機能

コンポーネントを呼び出す際は、Nuxt 3のオートインポート機能を活用すること。

### 使用方法
- コンポーネント呼び出し時は、ファイルパスに基づいた命名規則でタグ名を使用する
- **script内にimport文を記載しない**

### 命名規則の例
componentのファイル名はケバブケースにしてください。
タグはパスカルケースにしてください。
- `components/atoms/modal-window.vue` → `<AtomsModalWindow />`
- `components/molecules/card-item.vue` → `<MoleculesCardItem />`
- `components/organisms/header-nav.vue` → `<OrganismsHeaderNav />`

## コンポーネント設計 - Atomic Design

### ディレクトリ構造

```
components/
├── common/           # アプリケーション全体の共通コンポーネント
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
│
└── pages/           # ページごとのコンポーネント
    ├── home/
    │   ├── common/  # homeページスコープの共通コンポーネント
    │   │   ├── atoms/
    │   │   └── molecules/
    │   ├── atoms/
    │   ├── molecules/
    │   ├── organisms/
    │   └── templates/
    │
    ├── products/
    │   ├── common/  # productsページスコープの共通コンポーネント
    │   │   ├── atoms/
    │   │   └── molecules/
    │   ├── atoms/
    │   ├── molecules/
    │   ├── organisms/
    │   └── templates/
    │
    └── users/
        ├── common/  # usersページスコープの共通コンポーネント
        │   ├── atoms/
        │   └── molecules/
        ├── atoms/
        ├── molecules/
        ├── organisms/
        └── templates/
```

### Atomic Designの階層定義

1. **Atoms（原子）**
   - 最小単位のUIコンポーネント
   - 例：ボタン、インプット、ラベル、アイコン

2. **Molecules（分子）**
   - 複数のAtomsを組み合わせた小さな機能単位
   - 例：検索フォーム、カード、フォームフィールド

3. **Organisms（生物）**
   - MoleculesやAtomsを組み合わせた独立した機能セクション
   - 例：ヘッダー、フッター、サイドバー、カードリスト

4. **Templates（テンプレート）**
   - ページ全体のレイアウト構造
   - コンテンツは含まず、配置のみを定義

5. **Pages（ページ）**
   - 実際のコンテンツを含む完成されたページ
   - `pages/`ディレクトリで管理

### コンポーネント配置のルール

- **全体共通**: `components/common/`に配置
- **ページ固有**: `components/pages/[page-name]/`に配置
- **ページスコープ共通**: `components/pages/[page-name]/common/`に配置

## Pinia - 状態管理

### Composition API形式での実装

```typescript
// stores/useCounterStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0)
  const name = ref('Counter')

  // Getters
  const doubleCount = computed(() => count.value * 2)
  const displayName = computed(() => `${name.value}: ${count.value}`)

  // Actions
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = 0
  }

  function setName(newName: string) {
    name.value = newName
  }

  // Return
  return {
    // State
    count,
    name,
    // Getters
    doubleCount,
    displayName,
    // Actions
    increment,
    decrement,
    reset,
    setName
  }
})
```

### 使用例

```vue
<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.doubleCount }}</p>
    <CommonAtomsButton @click="counter.increment()">
      Increment
    </CommonAtomsButton>
  </div>
</template>

<script setup lang="ts">
// Piniaストアはオートインポートされる
const counter = useCounterStore()
</script>
```

## その他の規約

### TypeScript
- 型定義を積極的に活用する
- `types/`ディレクトリで共通の型定義を管理

### スタイリング
- Tailwind CSSのユーティリティクラスを使用
- カスタムCSSは最小限に抑える

### テスト実行
- `pnpm run test` でテストを実行
- `pnpm run lint` でリンターを実行
- `pnpm run typecheck` で型チェックを実行