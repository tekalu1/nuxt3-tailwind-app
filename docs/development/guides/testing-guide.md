# テストガイド

プロジェクトのテスト戦略とテストの書き方について説明します。

---

## テスト方針

### テストツール

- **Vitest**: 単体テスト・統合テスト
- **Playwright**: E2Eテスト
- **Storybook**: コンポーネントのビジュアルテスト・インタラクションテスト

### テストカバレッジ目標

- **ユーティリティ関数**: 100%
- **Composables**: 90%以上
- **APIエンドポイント**: 80%以上
- **コンポーネント**: 主要なものは60%以上

---

## テストファイル配置

**重要: テストファイルのディレクトリ構造は、テスト対象のファイル構造と正確に対応させてください。**

```
tests/
├── unit/                    # 単体テスト
│   ├── utils/              # utils/ と同じ構造
│   │   ├── format.test.ts
│   │   └── validation.test.ts
│   ├── composables/        # composables/ と同じ構造
│   │   ├── useAuth.test.ts
│   │   └── useUser.test.ts
│   ├── components/         # components/ と同じ構造
│   │   ├── common/
│   │   │   ├── atoms/
│   │   │   │   ├── button.test.ts
│   │   │   │   └── input.test.ts
│   │   │   ├── molecules/
│   │   │   └── organisms/
│   │   └── pages/
│   │       └── users/
│   └── server/             # server/ と同じ構造
│       ├── api/
│       │   └── users/
│       │       └── [id].get.test.ts
│       └── utils/
├── integration/            # 統合テスト
│   ├── api/               # APIの統合テスト
│   │   └── user-flow.test.ts
│   └── components/        # コンポーネントの統合テスト
│       └── user-registration.test.ts
└── e2e/                   # E2Eテスト
    └── scenarios/
        ├── user-login.spec.ts
        └── match-flow.spec.ts
```

### ディレクトリ構造のルール

- `tests/unit/` 配下は、対象ファイルのディレクトリ構造を **完全に再現** する
- テストファイル名は `{対象ファイル名}.test.ts` または `{対象ファイル名}.spec.ts`
- 空のディレクトリは作成しない（実際にテストファイルが存在する場合のみ作成）

**例:**
```
# 対象ファイル
components/common/atoms/button.vue

# 対応するテストファイル
tests/unit/components/common/atoms/button.test.ts
```

---

## 実装変更時のテスト確認フロー

**実装を変更した際は、必ず以下のチェックを行ってください。**

### 1. 影響範囲の特定

変更内容に応じて、影響を受けるテストの種類を判断します。

| 変更内容 | 単体テスト | 統合テスト | E2Eテスト | Storybook |
|---------|----------|----------|----------|-----------|
| **ユーティリティ関数の変更** | ✅ 必須 | ⚠️ 検討 | - | - |
| **Composablesの変更** | ✅ 必須 | ⚠️ 検討 | - | - |
| **コンポーネントのProps/Emits変更** | ✅ 必須 | - | - | ✅ 必須 |
| **コンポーネントのUI/スタイル変更** | - | - | - | ✅ 必須 |
| **API エンドポイントの変更** | ✅ 必須 | ✅ 必須 | ⚠️ 検討 | - |
| **ページの追加・変更** | - | ⚠️ 検討 | ✅ 必須 | - |
| **認証・認可ロジックの変更** | ✅ 必須 | ✅ 必須 | ✅ 必須 | - |
| **データベーススキーマの変更** | ✅ 必須 | ✅ 必須 | ⚠️ 検討 | - |
| **バリデーションルールの変更** | ✅ 必須 | ✅ 必須 | ⚠️ 検討 | - |

- ✅ 必須: 必ずテストの追加・修正が必要
- ⚠️ 検討: 影響範囲によっては必要
- `-`: 通常は不要

### 2. テストの追加・修正判断

**新規実装の場合:**
- 対応するテストファイルが存在しない場合は **新規作成が必須**
- テストファイルのパスは実装ファイルと対応させる

**既存実装の変更の場合:**
- 既存のテストファイルを確認し、**修正または追加が必要か判断**
- テストが存在しない場合は、この機会に作成を検討

---

## テストの種類ごとの確認ポイント

### 単体テスト (Unit Tests)

**対象:**
- `utils/` - ユーティリティ関数
- `composables/` - Composables
- `server/api/` - APIエンドポイント
- `components/` - コンポーネント（Props/Emits/ロジック）

**確認ポイント:**
```typescript
// ✅ 良い例: 関数の追加に伴うテスト追加
// utils/format.ts に formatDate 関数を追加
// → tests/unit/utils/format.test.ts に対応するテストを追加

describe('formatDate', () => {
  it('should format date correctly', () => {
    const result = formatDate(new Date('2025-01-15'))
    expect(result).toBe('2025-01-15')
  })

  it('should handle invalid date', () => {
    expect(() => formatDate(null)).toThrow()
  })
})
```

**チェックリスト:**
- [ ] 新規関数・メソッドにテストを追加したか
- [ ] 既存関数の変更に伴いテストケースを追加・修正したか
- [ ] エッジケース（null, undefined, 空文字など）をテストしたか
- [ ] エラーハンドリングをテストしたか

### 統合テスト (Integration Tests)

**対象:**
- APIエンドポイント間の連携
- コンポーネント間の連携
- データベースとの連携

**確認ポイント:**
```typescript
// ✅ 良い例: API連携のテスト
describe('User Registration Flow', () => {
  it('should create user and send verification email', async () => {
    const response = await $fetch('/api/users', {
      method: 'POST',
      body: { email: 'test@example.com', password: 'password123' }
    })

    expect(response.user).toBeDefined()
    expect(response.user.email).toBe('test@example.com')
    // メール送信の確認など
  })
})
```

**チェックリスト:**
- [ ] 複数のAPI呼び出しを含むフローをテストしたか
- [ ] データベースの状態変更を確認したか
- [ ] エラー時のロールバックをテストしたか

### E2Eテスト (End-to-End Tests)

**対象:**
- ユーザーフロー全体
- ページ遷移
- ユーザーインタラクション

**確認ポイント:**
```typescript
// ✅ 良い例: ユーザーログインフロー
test('user login flow', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1')).toContainText('ダッシュボード')
})
```

**チェックリスト:**
- [ ] 新規ページ追加に伴う画面遷移フローをテストしたか
- [ ] 認証が必要なページへのアクセス制御をテストしたか
- [ ] フォーム送信の成功・失敗パターンをテストしたか

### Storybookストーリー

**対象:**
- コンポーネントのビジュアル
- コンポーネントのインタラクション
- Props/Emitsのバリエーション

**確認ポイント:**
```typescript
// ✅ 良い例: Props変更に伴うストーリー追加
export const WithIcon: Story = {
  args: {
    icon: 'user',
    variant: 'primary',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
```

**チェックリスト:**
- [ ] 新しいPropsのバリエーションを追加したか
- [ ] UIの状態（hover, disabled, loading など）をストーリーで表現したか
- [ ] インタラクティブな動作をストーリーで確認できるか

詳細は [Storybookガイド](./storybook-guide.md) を参照。

---

## サンプルテストファイル

プロジェクトには、参考となるサンプルテストファイルが用意されています。

### 単体テスト

#### `tests/unit/utils/format.test.ts`
- 日付フォーマット関数のテスト
- エッジケース（無効な日付、null等）のテスト例
- 38個のテストケース

#### `tests/unit/utils/validation.test.ts`
- バリデーション関数のテスト（メール、パスワード、電話番号等）
- 正常系・異常系のテストパターン例

### 統合テスト

#### `tests/integration/api/mock-data.test.ts`
- モックデータを使った統合テスト
- 複数のヘルパー関数の連携テスト
- データ整合性のテスト
- 14個のテストケース

### サンプル実装

#### `utils/format.ts`
- 日付フォーマット関数（formatDate, formatDateJapanese, formatDateTime）
- 数値フォーマット関数（formatNumber）

#### `utils/validation.ts`
- バリデーション関数（isValidEmail, isValidPassword, isValidPhone等）

これらのサンプルを参考に、新しいテストを作成してください。

---

## テスト実行

### コマンド一覧

```bash
# 単体テストのみ実行
pnpm test:unit

# 特定のファイルのみテスト
pnpm test:unit tests/unit/utils/format.test.ts

# 統合テスト実行
pnpm test:integration

# E2Eテスト実行（まだ未実装）
pnpm test:e2e

# 単体テスト + 統合テストを実行（推奨）
pnpm test:unit && pnpm test:integration

# ウォッチモード（開発中）
pnpm test:watch

# UIモードでテスト実行
pnpm test:ui
```

**注意**: `pnpm test` はStorybookのブラウザテストも含むため、単体・統合テストのみ実行する場合は個別のコマンドを使用してください。

### テストカバレッジ確認

```bash
# カバレッジレポート生成
pnpm test:coverage

# カバレッジをブラウザで確認
# coverage/index.html を開く
```

**目標カバレッジを下回る場合:**
- 不足しているテストケースを特定
- テストを追加して再実行

---

## テスト作成のベストプラクティス

### 1. テストは実装と同時に作成

```bash
# ❌ 悪い例: 実装だけ先に進める
git commit -m "feat: formatDate 関数を追加"

# ✅ 良い例: 実装とテストを同時にコミット
git commit -m "feat: formatDate 関数を追加

- formatDate 関数の実装
- 単体テストの追加
- JSDocコメント追加"
```

### 2. 失敗するテストから書く（TDD）

```typescript
// 1. まず失敗するテストを書く
describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate(new Date('2025-01-15'))).toBe('2025-01-15')
  })
})

// 2. テストが通るように実装
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// 3. リファクタリング
```

### 3. わかりやすいテスト名

```typescript
// ❌ 悪い例
it('test1', () => { ... })
it('works', () => { ... })

// ✅ 良い例
it('should return formatted date string in YYYY-MM-DD format', () => { ... })
it('should throw error when date is null', () => { ... })
it('should handle leap year correctly', () => { ... })
```

### 4. Arrange-Act-Assert パターン

```typescript
it('should create user successfully', async () => {
  // Arrange: 準備
  const userData = {
    email: 'test@example.com',
    password: 'password123'
  }

  // Act: 実行
  const result = await createUser(userData)

  // Assert: 検証
  expect(result.id).toBeDefined()
  expect(result.email).toBe(userData.email)
})
```

### 5. モックの使用

```typescript
import { vi } from 'vitest'

describe('useAuth', () => {
  it('should call API on login', async () => {
    // モック作成
    const mockFetch = vi.fn().mockResolvedValue({
      user: { id: '1', name: 'Test User' }
    })

    global.$fetch = mockFetch

    const { login } = useAuth()
    await login('test@example.com', 'password')

    // モックが正しく呼ばれたか確認
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: { email: 'test@example.com', password: 'password' }
    })
  })
})
```

---

## テスト関連のチェックリスト

**実装変更時に必ず確認:**

- [ ] 変更内容に応じたテストの種類を特定した
- [ ] 新規実装の場合、対応するテストファイルを作成した
- [ ] 既存実装の変更の場合、既存テストを修正・追加した
- [ ] テストファイルのパスが実装ファイルと対応している
- [ ] エッジケースとエラーハンドリングをテストした
- [ ] すべてのテストが通過することを確認した
- [ ] テストカバレッジが目標値を満たしている
- [ ] Storybookストーリーが最新の状態になっている（コンポーネント変更時）

---

## 関連ドキュメント

- [開発ガイド トップ](../development-guide.md)
- [Storybookガイド](./storybook-guide.md)
- [コンポーネント開発ガイドライン](./component-guidelines.md)
- [Vitest 公式ドキュメント](https://vitest.dev/)
- [Playwright 公式ドキュメント](https://playwright.dev/)
