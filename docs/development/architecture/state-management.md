# 状態管理設計 (Pinia)

このドキュメントでは、クライアントサイド状態管理を担うPiniaストアの設計方針と実装パターンを定義します。

---

## 概要

本プロジェクトでは、クライアントサイドの状態管理にPiniaを使用します。Piniaは Vue 3 の公式状態管理ライブラリであり、以下の特徴を持ちます：

- **型安全**: TypeScript完全対応
- **軽量**: Vue 3のリアクティブシステムを直接利用
- **シンプル**: Vuexよりも直感的なAPI
- **DevTools対応**: Vue DevToolsで状態の監視・デバッグが可能

---

## 設計原則

### 1. 単一責任の原則
各ストアは1つの明確な責務のみを持ちます。例えば、認証ストアは認証関連の状態とロジックのみを管理します。

### 2. 再利用性
複数のコンポーネントから利用可能な、共通の状態管理ロジックを提供します。

### 3. 型安全性
すべてのストアでTypeScriptの型定義を完備し、型安全性を確保します。

### 4. パフォーマンス
必要最小限のリアクティブ化を行い、不要な再レンダリングを防ぎます。

### 5. キャッシュ戦略
適切なキャッシュ戦略を実装し、不要なAPI呼び出しを削減します。

---

## ストア一覧と責務

### 認証関連

#### `stores/auth.ts` - 認証ストア

**責務:**
- ユーザー認証状態管理
- ログイン/ログアウト処理
- 認証トークン管理
- セッション永続化

**State:**
```typescript
{
  user: User | null           // ログイン中のユーザー情報
  isAuthenticated: boolean    // 認証状態
  token: string | null        // 認証トークン
  loading: boolean            // 認証処理中フラグ
}
```

**Actions:**
- `login(email, password)`: ログイン処理
- `logout()`: ログアウト処理
- `register(userData)`: 新規登録
- `refreshToken()`: トークンリフレッシュ
- `fetchCurrentUser()`: 現在のユーザー情報取得

**Getters:**
- `isLoggedIn`: ログイン状態の真偽値
- `currentUser`: 現在のユーザー情報

---

### UI関連

#### `stores/ui.ts` - UIストア

**責務:**
- ローディング状態管理
- トースト通知管理
- モーダル状態管理
- グローバルUI状態

**State:**
```typescript
{
  loading: boolean                     // グローバルローディング
  loadingMessage: string | null        // ローディングメッセージ
  toasts: Toast[]                      // トースト通知リスト
  modals: { [key: string]: boolean }   // モーダル表示状態
}
```

**Actions:**
- `showLoading(message?)`: ローディング表示
- `hideLoading()`: ローディング非表示
- `showToast(toast)`: トースト表示
- `hideToast(id)`: トースト非表示
- `openModal(modalId)`: モーダル表示
- `closeModal(modalId)`: モーダル非表示

---

### ユーザー関連

#### `stores/user.ts` - ユーザーストア

**責務:**
- ユーザー一覧管理
- ユーザー検索
- ユーザー情報キャッシュ

**State:**
```typescript
{
  users: { [id: string]: User }  // ユーザー情報キャッシュ
  searchResults: User[]          // 検索結果
  loading: boolean               // 読み込み状態
}
```

**Actions:**
- `fetchUser(userId)`: ユーザー情報取得
- `searchUsers(query)`: ユーザー検索
- `updateUserCache(user)`: キャッシュ更新

**Getters:**
- `getUserById(id)`: IDでユーザー取得

#### `stores/profile.ts` - プロフィールストア

**責務:**
- 自分のプロフィール情報管理
- プロフィール編集状態管理

**State:**
```typescript
{
  profile: UserProfile | null  // プロフィール情報
  editing: boolean             // 編集中フラグ
  loading: boolean             // 読み込み状態
}
```

**Actions:**
- `fetchProfile()`: プロフィール取得
- `updateProfile(data)`: プロフィール更新
- `uploadAvatar(file)`: アバター画像アップロード

---

### 通知関連

#### `stores/notification.ts` - 通知ストア

**責務:**
- プッシュ通知履歴管理
- 通知設定管理
- 未読通知カウント

**State:**
```typescript
{
  notifications: Notification[]           // 通知履歴
  unreadCount: number                     // 未読カウント
  settings: {
    pushEnabled: boolean                  // プッシュ通知有効
    emailNotification: boolean            // メール通知
  }
}
```

**Actions:**
- `fetchNotifications()`: 通知履歴取得
- `markAsRead(notificationId)`: 既読マーク
- `markAllAsRead()`: 全て既読
- `updateSettings(settings)`: 通知設定更新

**Getters:**
- `unreadNotifications`: 未読通知一覧

---

### アプリケーション全体

#### `stores/app.ts` - アプリケーションストア

**責務:**
- アプリ全体の設定管理
- オフライン状態検知
- エラー状態管理

**State:**
```typescript
{
  online: boolean                   // オンライン状態
  errors: AppError[]                // エラーリスト
  settings: {
    theme: 'light' | 'dark'         // テーマ
    language: 'ja' | 'en'           // 言語
  }
}
```

**Actions:**
- `setOnlineStatus(online)`: オンライン状態更新
- `addError(error)`: エラー追加
- `clearErrors()`: エラークリア
- `updateSettings(settings)`: 設定更新

---

## 実装パターン

### 1. APIリクエストパターン

標準的なAPI呼び出しのパターンです。loading/error状態を管理し、エラー時にはユーザーにフィードバックを表示します。

```typescript
// stores/example.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', () => {
  const data = ref<Data[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/example')
      data.value = response
    } catch (e) {
      error.value = e as Error
      // エラートーストを表示
      const uiStore = useUiStore()
      uiStore.showToast({
        type: 'error',
        message: 'データの取得に失敗しました'
      })
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchData }
})
```

### 2. キャッシュ戦略パターン

データをキャッシュし、有効期限内であればキャッシュから返すパターンです。不要なAPI呼び出しを削減します。

```typescript
// stores/user.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const users = ref<{ [id: string]: User }>({})
  const cacheExpiry = ref<{ [id: string]: number }>({})
  const CACHE_DURATION = 5 * 60 * 1000 // 5分

  const fetchUser = async (userId: string, force = false) => {
    // キャッシュチェック
    const now = Date.now()
    const cached = users.value[userId]
    const expiry = cacheExpiry.value[userId]

    if (!force && cached && expiry && expiry > now) {
      return cached
    }

    // API呼び出し
    const user = await $fetch(`/api/users/${userId}`)
    users.value[userId] = user
    cacheExpiry.value[userId] = now + CACHE_DURATION

    return user
  }

  return { users, fetchUser }
})
```

### 3. Socket.io統合パターン

リアルタイム通信を行うSocket.ioとの統合パターンです。

```typescript
// stores/realtime.ts
import { ref, onUnmounted } from 'vue'
import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'

export const useRealtimeStore = defineStore('realtime', () => {
  const socket = ref<Socket | null>(null)
  const connected = ref(false)
  const messages = ref<{ [roomId: string]: Message[] }>({})

  const connectSocket = () => {
    const authStore = useAuthStore()

    socket.value = io('https://api.example.com', {
      auth: { token: authStore.token }
    })

    socket.value.on('connect', () => {
      connected.value = true
    })

    socket.value.on('disconnect', () => {
      connected.value = false
    })

    socket.value.on('message:received', (message: Message) => {
      onMessageReceived(message)
    })
  }

  const onMessageReceived = (message: Message) => {
    const roomId = message.roomId
    if (!messages.value[roomId]) {
      messages.value[roomId] = []
    }
    messages.value[roomId].push(message)
  }

  const sendMessage = (roomId: string, content: string) => {
    socket.value?.emit('message:send', { roomId, content })
  }

  onUnmounted(() => {
    socket.value?.disconnect()
  })

  return { socket, connected, messages, connectSocket, sendMessage }
})
```

---

## ベストプラクティス

### 1. Composition API形式で記述
`defineStore` の第2引数に関数を渡すComposition API形式を使用します。これにより、setup関数と同じ直感的な書き方が可能です。

### 2. refとcomputedを明示的にインポート
Nuxt 3ではオートインポートが有効ですが、Storybook環境では動作しません。互換性のため明示的にインポートします。

```typescript
import { ref, computed } from 'vue'
```

### 3. エラーハンドリングを必ず実装
すべてのAPI呼び出しをtry-catchでラップし、エラー時にはユーザーにフィードバックを提供します。

### 4. ローディング状態を管理
非同期処理中は必ずローディング状態を管理し、ユーザーに処理中であることを伝えます。

### 5. キャッシュ戦略を適切に実装
頻繁にアクセスされるデータはキャッシュし、不要なAPI呼び出しを削減します。

### 6. 型定義を完備
TypeScriptの恩恵を最大限に活用し、すべての状態とアクションに型定義を付けます。

### 7. ストア間の依存を最小化
ストア間の依存は必要最小限に留めます。他のストアを参照する場合は、循環参照に注意します。

### 8. 永続化が必要な場合は`pinia-plugin-persistedstate`を使用
ユーザー設定や認証トークンなど、永続化が必要な状態には専用プラグインを使用します。

```typescript
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // ...
}, {
  persist: true // 永続化を有効化
})
```

---

## 関連ドキュメント

- [システム設計](./system-design.md)
- [API設計](./api/README.md)
- [セキュリティ設計](./security.md)
- [コンポーネント開発ガイドライン](../guides/component-guidelines.md)
