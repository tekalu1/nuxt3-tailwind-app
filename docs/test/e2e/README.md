# E2Eテストガイド

ユーザーフロー全体を検証するE2E (End-to-End) テストについて説明します。

---

## 概要

E2Eテストは、実際のユーザー操作をシミュレートし、システム全体が正しく動作することを検証します。

### 対象

- ユーザーの操作フロー
- 画面遷移
- UI表示とインタラクション
- システム全体の統合

### 特徴

| 項目 | 内容 |
|------|------|
| 実行環境 | ブラウザ (Playwright) |
| モック | 原則なし (実際のAPIを使用) |
| データ | テスト用データベース |
| 実行時間 | 数十秒〜数分 |

---

## ディレクトリ構造

```
docs/test/e2e/
├── README.md              # 本ドキュメント
└── scenarios/             # シナリオドキュメント
    ├── _template.md       # テンプレート
    └── {機能名}.md        # 各機能のシナリオ

tests/e2e/
├── fixtures/             # テストフィクスチャ
├── pages/                # ページオブジェクト
└── scenarios/            # シナリオテスト
    └── {機能名}.spec.ts
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
cp docs/test/e2e/scenarios/_template.md \
   docs/test/e2e/scenarios/{機能名}.md
```

### 3. ユーザーストーリー記述

実際のユーザー操作を想定してストーリーを記述します。

### 4. パターンマトリクス作成

テスト条件の組み合わせを洗い出します。

### 5. テストケース抽出

具体的なテストケースを抽出します。

---

## テストコード実装

### ファイル配置

```
tests/e2e/scenarios/{機能名}.spec.ts
```

### 命名規則

```typescript
// ファイル名: kebab-case
user-management.spec.ts

// test.describe: 機能単位
test.describe('User Management', () => {
  // test.describe: ストーリー単位
  test.describe('Create User', () => {
    // test: 具体的なケース (ケースIDをコメント)
    // TC-E2E-USER-001
    test('should create new user', async ({ page }) => {
      // ...
    })
  })
})
```

### ページオブジェクトパターン

```typescript
// tests/e2e/pages/UserListPage.ts
export class UserListPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/users')
  }

  async clickCreateButton() {
    await this.page.click('[data-testid="create-user-button"]')
  }

  async fillUserForm(name: string, email: string) {
    await this.page.fill('[data-testid="user-name-input"]', name)
    await this.page.fill('[data-testid="user-email-input"]', email)
  }

  async save() {
    await this.page.click('[data-testid="save-button"]')
  }
}
```

### テスト実装例

```typescript
import { test, expect } from '@playwright/test'
import { UserListPage } from '../pages/UserListPage'

test.describe('User Management', () => {
  // TC-E2E-USER-001
  test('should create new user', async ({ page }) => {
    const userList = new UserListPage(page)

    await userList.goto()
    await userList.clickCreateButton()
    await userList.fillUserForm('John Doe', 'john@example.com')
    await userList.save()

    await expect(page.locator('.success-toast')).toBeVisible()
    await expect(page.locator('[data-testid="user-list-table"]')).toContainText('John Doe')
  })
})
```

---

## セレクタ戦略

### 優先順位

1. **data-testid**: テスト専用属性
2. **role**: アクセシビリティロール
3. **text**: 表示テキスト
4. **CSS/XPath**: 最終手段

### 例

```typescript
// Good: data-testid
await page.click('[data-testid="save-button"]')

// Good: role
await page.click('button[name="save"]')

// OK: text (変更されにくい場合)
await page.click('text=保存')

// Avoid: CSS selector
await page.click('.btn.btn-primary.save')
```

### data-testid 命名規則

```
{コンポーネント}-{要素}-{状態}

例:
- user-list-table
- user-form-input-name
- product-card-button-add
```

---

## テスト実行

### コマンド

```bash
# 全E2Eテスト実行
pnpm test:e2e

# 特定ファイルのみ
pnpm playwright test tests/e2e/scenarios/user-management.spec.ts

# UIモードで実行
pnpm playwright test --ui

# デバッグモード
pnpm playwright test --debug
```

### CI設定

```yaml
# .github/workflows/test.yml
- name: E2E Tests
  run: pnpm test:e2e
  env:
    CI: true
```

---

## ベストプラクティス

### テストの独立性

```typescript
test.beforeEach(async ({ page }) => {
  // 各テスト前にクリーンな状態を作成
  await resetTestData()
})
```

### 待機戦略

```typescript
// Bad: 固定時間待機
await page.waitForTimeout(3000)

// Good: 条件待機
await page.waitForSelector('[data-testid="loaded"]')
await expect(page.locator('.result')).toBeVisible()
```

### スクリーンショット

```typescript
test('visual check', async ({ page }) => {
  await page.goto('/flows')
  await expect(page).toHaveScreenshot('flow-list.png')
})
```

### 並列実行

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
})
```

---

## チェックリスト

### シナリオ作成時

- [ ] 機能要件を確認した
- [ ] ユーザーストーリーを記述した
- [ ] パターンマトリクスを作成した
- [ ] テストケースにIDを付与した
- [ ] 優先度を設定した

### 実装時

- [ ] ページオブジェクトを使用した
- [ ] data-testid を使用した
- [ ] 適切な待機を実装した
- [ ] ケースIDをコメントに記載した

### レビュー時

- [ ] シナリオとテストコードが対応している
- [ ] 実装状況が更新されている
- [ ] フレークテストになっていない

---

## トラブルシューティング

### テストが不安定

1. 固定時間待機を条件待機に変更
2. テストデータの独立性を確認
3. 並列実行時の競合を確認

### 要素が見つからない

1. セレクタが正しいか確認
2. 要素が表示されるまで待機しているか確認
3. iframe内の要素でないか確認

### タイムアウト

1. タイムアウト値を調整
2. ネットワーク待機を追加
3. 重い処理の前にローディング待機

---

## 関連ドキュメント

- [テストプロセス](../README.md)
- [テストガイド](../../development/guides/testing-guide.md)
- [シナリオテンプレート](./scenarios/_template.md)
- [Playwright公式ドキュメント](https://playwright.dev/)
