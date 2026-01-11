# テストガイド

プロジェクトのテスト戦略とテストの書き方について説明します。

---

## テスト作成の基本原則

**重要: テストの作成・実施には `test-engineer` エージェントを使用してください。**

テストエージェントは以下を自動的に考慮します:
- シナリオの網羅性
- パターンの漏れ防止
- UI↔バックエンド整合性の確認

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

#### E2Eテスト設計の重要原則

**1. 実行結果の成功/失敗を明示的に検証する**

```typescript
// ❌ 悪い例: どのステータスでもパスしてしまう
const statusText = await statusBadge.textContent()
expect(['実行中', '完了', '失敗']).toContain(statusText)

// ✅ 良い例: 成功を明示的に検証
const statusText = await statusBadge.textContent()
if (statusText === '失敗') {
  // エラー内容を確認してテストを失敗させる or スキップ
  const errorMessage = await page.locator('.error-message').textContent()
  if (errorMessage?.includes('API key not configured')) {
    test.skip() // 外部依存の問題はスキップ
    return
  }
  throw new Error(`Unexpected failure: ${errorMessage}`)
}
expect(statusText).toBe('完了')
```

**2. 外部依存（APIキー等）がある場合の設計**

```typescript
// ✅ 良い例: 外部サービス依存のテストは環境に応じて処理
test('should execute LLM flow', async ({ page }) => {
  // APIキーがない環境での失敗は想定内としてスキップ
  const errorVisible = await page.locator('text=Provider not available').isVisible()
  if (errorVisible) {
    console.warn('⚠️ LLM test skipped: API key not configured')
    test.skip()
    return
  }

  // 成功を検証
  await expect(page.locator('.status-badge')).toHaveText('完了')
})
```

**3. セレクタの堅牢性**

```typescript
// ❌ 悪い例: 複数要素に解決される可能性
const link = page.locator('a[href="/flows"]')
await expect(link).toBeVisible() // strict mode violation!

// ✅ 良い例: 明示的に最初の要素を選択
const links = page.locator('a[href="/flows"]')
await expect(links.first()).toBeVisible()

// ✅ 良い例: より具体的なセレクタを使用
const backLink = page.locator('header a[href="/flows"]')
await expect(backLink).toBeVisible()
```

**4. UI文字列の変更に強いテスト**

```typescript
// ❌ 悪い例: ハードコードされた日本語文字列
await expect(page.locator('h1')).toContainText('ダッシュボード')

// ✅ 良い例: セレクタベースで検証（文字列変更に強い）
await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible()

// ✅ 良い例: 複数言語に対応
await expect(page.locator('h1')).toBeVisible()
const title = await page.locator('h1').textContent()
expect(['Dashboard', 'ダッシュボード']).toContain(title)
```

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

## シナリオ・パターン網羅チェックリスト

テストの漏れを防ぐため、以下のチェックリストを使用してください。

### シナリオ網羅チェック

#### UI↔バックエンド整合性テスト

**必須:** UIで提供される機能がバックエンドで正しく実装されているか確認する。

```typescript
// ✅ 良い例: UIのデフォルトツールがすべて登録されているか確認
describe('Tool Registry - UI Tool Availability', () => {
  const uiDefaultTools = [
    'builtin.control.start',
    'builtin.control.end',
    'builtin.control.if',
    // ... UIで提供されるすべてのツール
  ]

  it('should have all UI default tools registered', () => {
    for (const toolId of uiDefaultTools) {
      expect(hasToolHandler(toolId), `Tool ${toolId} should be registered`).toBe(true)
    }
  })
})
```

**チェックリスト:**
- [ ] UIで提供される機能（ツール、コンポーネント）がバックエンドに実装されている
- [ ] UIとバックエンドで使用するID/キーが一致している
- [ ] UIの操作が実際のAPIエンドポイントで正しく処理される

#### ユーザーフローベーステスト

**必須:** 実際のユーザー操作をシミュレートしたテストを作成する。

```typescript
// ✅ 良い例: ユーザーがUIで作成するフローと同じ構造でテスト
function createRealUserFlow(): Flow {
  return {
    nodes: [
      // UIで作成されるフローと同じ構造
      { id: 'start', flowId: 'builtin.control.start', ... },
      { id: 'process', flowId: 'builtin.data.setVariable', ... },
      { id: 'end', flowId: 'builtin.control.end', ... },
    ],
    edges: [...]
  }
}
```

**チェックリスト:**
- [ ] 新規作成フロー（デフォルトのstart/endノード含む）をテスト
- [ ] ユーザーがUIで行う典型的な操作をシナリオとしてテスト
- [ ] エラー発生時のUI表示とバックエンドレスポンスの整合性を確認

### パターン網羅チェック

#### 登録確認テスト

**必須:** 「何が登録/実装されているべきか」を明示的にテストする。

| 対象 | テスト内容 |
|------|-----------|
| ToolRegistry | すべてのビルトインツールが登録されている |
| APIエンドポイント | すべての必須エンドポイントが存在する |
| ストア | 必要なアクション/ゲッターが実装されている |
| コンポーネント | 必要なprops/emitsが定義されている |

#### エラーパステスト

**必須:** 異常系のテストを網羅する。

```typescript
// ✅ 良い例: 未登録ツールの動作確認
it('should fail gracefully when tool is not found', async () => {
  const result = await engine.executeFlow(flowWithInvalidTool)
  expect(result.status).toBe('failed')
  expect(result.error.message).toContain('Tool not found')
})
```

**チェックリスト:**
- [ ] 未登録/無効なID使用時のエラーハンドリング
- [ ] 必須パラメータ欠落時の動作
- [ ] 型不一致時の動作
- [ ] 外部サービス障害時の動作

#### 外部サービス依存テストの戦略

外部サービス（LLM API、メール送信等）に依存するテストは特別な配慮が必要です。

**原則:**
1. **ユニット/統合テスト**: モックを使用し、外部依存を排除
2. **E2Eテスト**: 実際の外部サービスを呼び出すが、設定不備時は適切にスキップ

```typescript
// ✅ 良い例: 外部依存の適切な処理
describe('LLM Integration', () => {
  // ユニットテスト: モックを使用
  it('should handle LLM response correctly', async () => {
    const mockLLM = vi.fn().mockResolvedValue({ content: 'test response' })
    const result = await processWithLLM('input', { llmService: mockLLM })
    expect(result).toBe('processed: test response')
  })

  // 統合テスト: モックまたは設定確認
  it('should call LLM service with correct parameters', async () => {
    // APIキーがない場合はスキップ
    if (!process.env.OPENAI_API_KEY) {
      test.skip()
      return
    }
    // 実際のAPIを呼び出すテスト...
  })
})
```

**E2Eテストでの外部依存処理:**
```typescript
// 外部APIが必要なテストのパターン
test('should execute flow with LLM', async ({ page }) => {
  await page.goto('/flows/test-flow')
  await page.click('button:has-text("実行")')
  await page.waitForTimeout(3000)

  // エラーメッセージを確認
  const providerError = await page.locator('text=Provider not available').isVisible()
  const apiKeyError = await page.locator('text=APIキーが設定されていません').isVisible()

  if (providerError || apiKeyError) {
    // 環境設定の問題 → テストをスキップ（設定不備はテスト対象外）
    console.warn('⚠️ External service not configured - skipping test')
    test.skip()
    return
  }

  // 本来テストしたい内容を検証
  await expect(page.locator('.status-badge')).toHaveText('完了')
})
```

#### 境界値・特殊値テスト

```typescript
// ✅ 良い例: 境界値のテスト
const edgeCases = [
  { input: '', expected: 'empty string handled' },
  { input: null, expected: 'null handled' },
  { input: undefined, expected: 'undefined handled' },
  { input: [], expected: 'empty array handled' },
  { input: {}, expected: 'empty object handled' },
  { input: 'a'.repeat(10000), expected: 'very long string handled' },
]
```

**チェックリスト:**
- [ ] 空値（空文字、空配列、空オブジェクト）
- [ ] null/undefined
- [ ] 極端に大きな値/長い文字列
- [ ] 特殊文字（XSS文字列、SQLインジェクション文字列）
- [ ] 循環参照

---

## テスト工程別の改善ポイント

### 1. 計画フェーズ

**テストシナリオマトリクスの作成:**

| 機能 | ユニットテスト | 統合テスト | E2E | UI整合性 |
|------|--------------|-----------|-----|---------|
| 新規ツール追加 | ハンドラテスト | フロー実行 | 実行確認 | ツール選択可能 |
| APIエンドポイント | レスポンス形式 | DB連携 | 画面表示 | エラー表示 |
| UIコンポーネント | props/emits | 親子連携 | ユーザー操作 | - |

### 2. 設計フェーズ

**テストファースト設計:**
1. UIで提供する機能を先に定義
2. その機能に必要なバックエンドAPIを特定
3. 「登録確認テスト」を先に書く
4. 実装を進める

### 3. 実装フェーズ

**チェックポイント:**
- 新しいツール/機能を追加したら、登録確認テストに追加
- UIに機能を追加したら、対応するバックエンドテストを確認
- モック使用時は、実際のAPIとの整合性を確認

### 4. レビューフェーズ

**レビュー項目:**
- [ ] UIで使用可能な機能がすべてバックエンドでテストされているか
- [ ] エラーパスがテストされているか
- [ ] 境界値がテストされているか
- [ ] 実際のユーザーフローがシミュレートされているか

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

**シナリオ・パターン網羅（追加）:**

- [ ] UI↔バックエンド整合性テストを作成した
- [ ] 登録確認テストを更新した（新規機能追加時）
- [ ] ユーザーフローベースのテストを作成した
- [ ] エラーパス・境界値テストを作成した

**E2Eテスト品質（追加）:**

- [ ] 実行結果の成功/失敗を明示的に検証している（「失敗」でもパスするテストになっていない）
- [ ] 外部サービス依存のテストは設定不備時に適切にスキップする
- [ ] セレクタが複数要素に解決される可能性を考慮している（`.first()`の使用等）
- [ ] UI文字列の変更に強いテスト設計になっている（`data-testid`の活用等）
- [ ] トースト/モーダル表示後、時間経過後も表示が持続することを確認している（状態持続性テスト）

**非同期処理・状態管理（追加）:**

- [ ] `setTimeout`/`setInterval`を使用するコードに競合状態テストがあるか
- [ ] 連続操作（開く→閉じる→開く等）をシミュレートしたテストがあるか
- [ ] `vi.useFakeTimers()`でタイマーを制御しているか
- [ ] タイマー経過後の状態を検証しているか
- [ ] 重要なストアには統合テスト（実際のPiniaを使用）があるか

---

## 非同期処理・状態管理のテスト

非同期処理（タイマー、Promise、イベント）を含むコードは、タイミング依存のバグ（Race Condition）が発生しやすいため、特別なテスト戦略が必要です。

### 非同期処理を含むコードの分類

| 種類 | 例 | リスク | 必須テスト |
|------|-----|--------|----------|
| **タイマー** | `setTimeout`, `setInterval`, debounce, throttle | 連続操作での競合状態 | タイマーモック + 競合シナリオ |
| **状態遷移** | モーダル開閉、ローディング状態 | 状態の不整合 | 連続遷移テスト |
| **API呼び出し** | `$fetch`, `useFetch` | レスポンス順序の逆転 | 並列リクエストテスト |
| **イベント** | ユーザー入力、WebSocket | イベント順序依存 | 高速連続イベントテスト |

### 必須テストパターン

#### 1. 競合状態テスト（Race Condition Test）

**対象:** タイマーや非同期処理を含むすべてのストア・コンポーザブル

```typescript
// ✅ 良い例: 連続操作での競合状態をテスト
describe('Race Condition防止', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('close後すぐにopenしても状態が正しいこと', () => {
    const store = useModalStore()

    // 最初のモーダルを開いて閉じる
    store.openModal({ type: 'confirm', message: '確認' })
    store.closeModal()

    // 即座に新しいモーダルを開く
    store.showSuccess('成功')

    // タイマー経過後も状態が維持されること
    vi.advanceTimersByTime(500)
    expect(store.config?.message).toBe('成功')
  })
})
```

**チェックリスト:**
- [ ] `setTimeout`/`setInterval`を使用するコードに競合テストがあるか
- [ ] 連続した操作（開く→閉じる→開く）をシミュレートしているか
- [ ] タイマー経過後の状態を検証しているか

#### 2. 状態持続性テスト（State Persistence Test）

**対象:** すべてのE2Eテストでのトースト・モーダル・通知の検証

```typescript
// ❌ 悪い例: 表示されたことだけを確認（一瞬で消えても検出できない）
const toast = page.locator('text=成功')
await expect(toast).toBeVisible({ timeout: 5000 })

// ✅ 良い例: 表示後も持続していることを確認
const toast = page.locator('text=成功')
await expect(toast).toBeVisible({ timeout: 5000 })
// 状態持続性確認: Race Conditionで消えていないことを検証
await page.waitForTimeout(300)
await expect(toast).toBeVisible()
```

**適用場面:**
- トースト通知
- モーダル表示
- ローディング状態
- エラーメッセージ

#### 3. 連続アクションテスト（Rapid Action Test）

**対象:** ボタン連打、フォーム連続送信などのユーザー操作

```typescript
// ✅ 良い例: 連続クリックでも正しく動作すること
it('連続クリックでも1回だけ実行されること', async () => {
  const submitFn = vi.fn()
  const { result } = renderHook(() => useSubmit(submitFn))

  // 高速で3回クリック
  await result.current.submit()
  await result.current.submit()
  await result.current.submit()

  expect(submitFn).toHaveBeenCalledTimes(1)
})
```

### ユニットテストでの非同期処理

#### Vitestのタイマーモック

```typescript
import { vi, beforeEach, afterEach } from 'vitest'

describe('Timer-based functionality', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounce後に実行されること', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 300)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('連続呼び出しでは最後の1回だけ実行されること', () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 300)

    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledTimes(1)
  })
})
```

### 統合テストでの非同期処理

モックを使いすぎると実際のタイミング問題を見逃す可能性があるため、重要なストアは統合テストも作成します。

```typescript
// ✅ 良い例: 実際のPiniaストアを使った統合テスト
describe('Modal Store Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('confirm→showSuccessの連続呼び出しでメッセージが維持されること', async () => {
    const store = useModalStore()

    // 確認ダイアログを開いてconfirmをクリック
    const promise = store.confirm('確認しますか？')
    store.handleConfirm()
    await promise

    // 即座に成功モーダルを表示
    store.showSuccess('完了しました')

    // 200ms以上経過後もメッセージが残っていること
    vi.advanceTimersByTime(300)
    expect(store.config?.message).toBe('完了しました')
  })
})
```

### コードレビューチェックリスト（非同期処理）

コードレビュー時に以下を確認してください：

#### 実装コードのチェック

- [ ] `setTimeout`/`setInterval`を使用している場合、クリーンアップ処理があるか
- [ ] タイマーIDを保持し、必要に応じてclearTimeout/clearIntervalしているか
- [ ] 状態変更とタイマーの間で競合が発生しないか
- [ ] Promiseチェーンで状態が不整合にならないか

```typescript
// ❌ 悪い例: タイマーがキャンセルされない
function closeModal() {
  isOpen.value = false
  setTimeout(() => {
    config.value = null  // 後から開いたモーダルのconfigも消える！
  }, 200)
}

// ✅ 良い例: タイマーを管理
let timer: ReturnType<typeof setTimeout> | null = null

function closeModal() {
  isOpen.value = false
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    if (!isOpen.value) config.value = null  // 開いていない場合のみクリア
    timer = null
  }, 200)
}

function openModal(cfg: ModalConfig) {
  if (timer) {
    clearTimeout(timer)  // 既存のタイマーをキャンセル
    timer = null
  }
  config.value = cfg
  isOpen.value = true
}
```

#### テストコードのチェック

- [ ] `vi.useFakeTimers()`を使用してタイマーをモックしているか
- [ ] 競合状態（連続操作）のテストがあるか
- [ ] E2Eで状態の持続性を確認しているか
- [ ] Promiseの解決順序に依存するテストケースがあるか

### 非同期処理テストのベストプラクティス

| カテゴリ | ベストプラクティス | アンチパターン |
|---------|------------------|---------------|
| タイマー | `vi.useFakeTimers()`で制御 | 実時間waitに依存 |
| 競合状態 | 連続操作シナリオをテスト | 単発操作のみテスト |
| 状態持続 | 時間経過後も検証 | 表示確認のみ |
| クリーンアップ | afterEachでリセット | グローバル状態の残留 |
| モック範囲 | 外部依存のみモック | 内部ロジックまでモック |

---

## 関連ドキュメント

- [開発ガイド トップ](../development-guide.md)
- [Storybookガイド](./storybook-guide.md)
- [コンポーネント開発ガイドライン](./component-guidelines.md)
- [Vitest 公式ドキュメント](https://vitest.dev/)
- [Playwright 公式ドキュメント](https://playwright.dev/)
