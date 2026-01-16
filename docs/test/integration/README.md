# 統合テストガイド

API・サービス間の連携を検証する統合テストについて説明します。

---

## 概要

統合テストは、複数のコンポーネント・サービスが正しく連携することを検証します。

### 対象

- API エンドポイント
- サービス間の連携
- データベース操作
- 外部サービス連携

### 特徴

| 項目 | 内容 |
|------|------|
| 実行環境 | Node.js (Vitest) |
| モック | 外部サービスのみモック |
| データ | テスト用データベース or インメモリ |
| 実行時間 | 数秒〜数十秒 |

---

## ディレクトリ構造

```
docs/test/integration/
├── README.md              # 本ドキュメント
└── scenarios/             # シナリオドキュメント
    ├── _template.md       # テンプレート
    └── {機能名}.md        # 各機能のシナリオ

tests/integration/
├── services/             # サービス関連
│   ├── UserService.test.ts
│   └── ProductService.test.ts
├── api/                  # API関連
│   └── users.test.ts
└── stores/               # Piniaストア関連
    └── cart.test.ts
```

---

## シナリオ作成

### 1. 機能要件の確認

まず、テスト対象の機能要件を確認します。

```
docs/requirements/features/{画面名}.md
```

### 2. シナリオドキュメント作成

テンプレートをコピーしてシナリオを作成します。

```bash
cp docs/test/integration/scenarios/_template.md \
   docs/test/integration/scenarios/{機能名}.md
```

### 3. パターンマトリクス作成

テスト条件の組み合わせを洗い出します。

### 4. テストケース抽出

具体的なテストケースを抽出します。

---

## テストコード実装

### ファイル配置

```
tests/integration/{カテゴリ}/{機能名}.test.ts
```

### 命名規則

```typescript
// ファイル名: kebab-case
tool-handlers.test.ts

// describe: 機能単位
describe('Tool Handlers', () => {
  // describe: カテゴリ
  describe('LLM Chat Tool', () => {
    // it: 具体的なケース (ケースIDをコメント)
    // TC-IT-TOOL-001
    it('should execute with valid input', async () => {
      // ...
    })
  })
})
```

### 典型的なパターン

#### APIテスト

```typescript
import { $fetch } from '@nuxt/test-utils'

describe('Flows API', () => {
  it('should return flow list', async () => {
    const response = await $fetch('/api/flows')
    expect(response).toHaveProperty('flows')
  })
})
```

#### サービステスト

```typescript
import { ProductService } from '~/server/services/ProductService'

describe('Product Service', () => {
  it('should create product', async () => {
    const service = new ProductService()
    const result = await service.createProduct({ name: 'Test Product', price: 1000 })
    expect(result.id).toBeDefined()
    expect(result.name).toBe('Test Product')
  })
})
```

#### Piniaストアテスト

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '~/stores/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add item to cart', async () => {
    const cartStore = useCartStore()
    await cartStore.addItem({ productId: '123', quantity: 1 })
    expect(cartStore.items).toHaveLength(1)
  })
})
```

---

## モック戦略

### モックすべきもの

| 対象 | 理由 | モック方法 |
|------|------|-----------|
| 外部API (LLM等) | コスト・安定性 | vi.mock |
| ファイルシステム | テスト独立性 | memfs |
| 時間 | 再現性 | vi.useFakeTimers |

### モックしないもの

| 対象 | 理由 |
|------|------|
| データベース | 実際の動作を検証 |
| 内部サービス | 連携を検証 |
| バリデーション | 実際の検証 |

### モック例

```typescript
import { vi } from 'vitest'

// 外部決済APIのモック
vi.mock('~/server/services/PaymentService', () => ({
  PaymentService: {
    processPayment: vi.fn().mockResolvedValue({
      transactionId: 'mock-txn-123',
      status: 'success'
    })
  }
}))
```

---

## テスト実行

### コマンド

```bash
# 全統合テスト実行
pnpm test:integration

# 特定ファイルのみ
pnpm vitest run tests/integration/engine/tool-handlers.test.ts

# ウォッチモード
pnpm vitest tests/integration
```

### CI設定

```yaml
# .github/workflows/test.yml
- name: Integration Tests
  run: pnpm test:integration
```

---

## チェックリスト

### シナリオ作成時

- [ ] 機能要件を確認した
- [ ] 正常系のフローを記述した
- [ ] 異常系のフローを記述した
- [ ] パターンマトリクスを作成した
- [ ] テストケースにIDを付与した

### 実装時

- [ ] ケースIDをコメントに記載した
- [ ] 外部依存をモックした
- [ ] クリーンアップ処理を実装した
- [ ] エラーケースをテストした

### レビュー時

- [ ] シナリオとテストコードが対応している
- [ ] 実装状況が更新されている
- [ ] モック範囲が適切

---

## 関連ドキュメント

- [テストプロセス](../README.md)
- [テストガイド](../../development/guides/testing-guide.md)
- [シナリオテンプレート](./scenarios/_template.md)
