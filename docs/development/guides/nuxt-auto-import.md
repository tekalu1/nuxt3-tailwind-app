# Nuxt 3 オートインポート

Nuxt 3のオートインポート機能について説明します。

---

## 基本原則

**Nuxt 3 のオートインポート機能を必ず使用してください。手動でのインポートは行わないでください。**

---

## オートインポート対象

以下は自動的にインポートされるため、`import` 文を記述する必要はありません:

```typescript
// ❌ 誤り: 手動インポート
import { ref, computed, watch } from 'vue'
import { navigateTo, useFetch, useRoute } from 'nuxt/app'

// ✅ 正しい: オートインポート（import文不要）
const count = ref(0)
const doubled = computed(() => count.value * 2)
const route = useRoute()
const { data } = await useFetch('/api/users')
```

### オートインポートされるもの

1. **Vue 3 API**
   - `ref`, `computed`, `reactive`, `readonly`
   - `watch`, `watchEffect`
   - `onMounted`, `onUnmounted`, `onBeforeMount` など
   - `nextTick`, `toRef`, `toRefs` など

2. **Nuxt Composables**
   - `useFetch`, `useAsyncData`
   - `useRoute`, `useRouter`, `navigateTo`
   - `useState`, `useCookie`
   - `useHead`, `useSeoMeta`
   - その他すべてのNuxtビルトインComposables

3. **プロジェクト内のファイル**
   - `components/` 配下のコンポーネント
   - `composables/` 配下の関数
   - `utils/` 配下のエクスポートされた関数

---

## 明示的なインポートが必要なもの

以下のみ手動でインポートしてください:

```typescript
// ✅ 型定義は手動インポート
import type { User } from '~/types/user'

// ✅ 外部ライブラリは手動インポート
import dayjs from 'dayjs'

// ✅ サーバーサイド専用のユーティリティ（server/ 配下）
import { validateUser } from '~/server/utils/validation'

// ✅ JSON ファイルなどの静的アセット
import config from '~/config.json'
```

### 手動インポートが必要なもの

- 型定義（`import type { ... }`）
- 外部ライブラリ（npm パッケージ）
- `server/` 配下のファイル
- JSON ファイルなどの静的アセット

---

## コンポーネントのオートインポート

```vue
<template>
  <!-- ✅ 正しい: components/ 配下のコンポーネントは自動インポート -->
  <!-- ファイル名はケバブケース、呼び出しはパスカルケース -->
  <CommonAtomsButton>Click me</CommonAtomsButton>
  <CommonOrganismsUserCard :user="user" />
</template>

<script setup lang="ts">
// ❌ 誤り: コンポーネントの手動インポート
// import Button from '~/components/common/atoms/button.vue'

// コンポーネントは自動的に使用可能
</script>
```

### コンポーネント名の規則

- **ファイル名**: kebab-case（ケバブケース）
- **テンプレート呼び出し**: PascalCase（パスカルケース）
- ディレクトリ構造がPascalCaseで連結される

**例:**
- `components/common/atoms/button.vue` → `<CommonAtomsButton>`
- `components/pages/users/organisms/user-list.vue` → `<PagesUsersOrganismsUserList>`
- `components/common/molecules/search-box.vue` → `<CommonMoleculesSearchBox>`

---

## 注意事項

### 1. ESLintの警告に注意

オートインポートされた関数に対して「未定義」の警告が出る場合:
- `.nuxt/imports.d.ts` を確認
- 必要に応じて開発サーバーを再起動

### 2. 型補完が効かない場合

```bash
# Nuxt の型定義を再生成
pnpm nuxt prepare
```

### 3. 明示的にインポートしたい場合

基本的に不要ですが、コードの可読性のために明示したい場合は `#imports` を使用:

```typescript
// 特別な理由がある場合のみ
import { ref, computed } from '#imports'
```

---

## Storybook環境での注意点

**重要: Storybook環境ではNuxt 3のオートインポートが機能しません。**

Storybookでコンポーネントを開発する際は、Vue APIを明示的にインポートする必要があります。

詳細は [Storybookガイド](./storybook-guide.md) を参照してください。

---

## 関連ドキュメント

- [開発ガイド トップ](../development-guide.md)
- [Storybookガイド](./storybook-guide.md)
- [Nuxt 3 公式ドキュメント - Auto Imports](https://nuxt.com/docs/guide/concepts/auto-imports)
