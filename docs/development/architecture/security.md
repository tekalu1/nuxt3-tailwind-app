# セキュリティ設計

## セキュリティ原則

### 基本方針

1. **最小権限の原則**: 必要最小限の権限のみ付与
2. **多層防御**: 複数のセキュリティレイヤーを実装
3. **デフォルト拒否**: 明示的に許可されたもののみアクセス可
4. **セキュアバイデザイン**: 設計段階からセキュリティを考慮

---

## 認証 (Authentication)

### Firebase Authentication

**採用理由:**
- 業界標準のセキュリティ
- OAuth2.0対応
- 多要素認証サポート
- SDKの充実

**実装方法:**

```typescript
// クライアント側 (composables/useAuth.ts)
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    const auth = getAuth()
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await userCredential.user.getIdToken()
    return idToken
  }

  return { login }
}
```

```typescript
// サーバー側 (server/middleware/auth.ts)
import { getAuth } from 'firebase-admin/auth'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token)
    event.context.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})
```

### トークン管理

**ID Token:**
- 有効期限: 1時間
- 自動リフレッシュ機能を実装
- HTTPSでのみ送信

**Refresh Token:**
- 有効期限: 30日
- HttpOnly Cookieで保存
- CSRF対策を実装

---

## 認可 (Authorization)

### ロールベースアクセス制御 (RBAC)

**ユーザーロール:**

| ロール | 権限 |
|-------|------|
| `user` | 基本機能の利用 |
| `premium` | プレミアム機能の利用 |
| `moderator` | ユーザー管理、コンテンツモデレーション |
| `admin` | システム全体の管理 |

**実装例:**

```typescript
// server/utils/authorization.ts
export const checkRole = (user: User, requiredRole: string) => {
  const roleHierarchy = {
    admin: 4,
    moderator: 3,
    premium: 2,
    user: 1
  }

  const userLevel = roleHierarchy[user.role] || 0
  const requiredLevel = roleHierarchy[requiredRole] || 0

  return userLevel >= requiredLevel
}

// 使用例
export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!checkRole(user, 'moderator')) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    })
  }

  // 処理続行
})
```

### リソースベースアクセス制御

**自分のリソースのみアクセス可能:**

```typescript
// server/api/profiles/[id].put.ts
export default defineEventHandler(async (event) => {
  const user = event.context.user
  const profileId = getRouterParam(event, 'id')

  const profile = await prisma.profile.findUnique({
    where: { id: profileId }
  })

  if (profile.userId !== user.uid) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    })
  }

  // 更新処理
})
```

---

## データ保護

### 個人情報の暗号化

**暗号化対象:**
- メールアドレス (検索用ハッシュも保持)
- 位置情報
- チャットメッセージ (オプション)

**実装例:**

```typescript
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY // 32バイト
const IV_LENGTH = 16

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export const decrypt = (text: string): string => {
  const parts = text.split(':')
  const iv = Buffer.from(parts.shift()!, 'hex')
  const encrypted = Buffer.from(parts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encrypted)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
```

### パスワードハッシュ

Firebase Authenticationが自動的にbcryptでハッシュ化

---

## 入力バリデーション

### XSS対策

**サニタイゼーション:**

```typescript
import DOMPurify from 'isomorphic-dompurify'

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // HTMLタグを全て削除
    ALLOWED_ATTR: []
  })
}

// 使用例
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  body.bio = sanitizeHtml(body.bio)
  // 処理続行
})
```

**Vue.jsの自動エスケープ:**
- テンプレート内の変数は自動的にエスケープされる
- `v-html`は使用しない

### SQLインジェクション対策

**Prismaのプリペアドステートメント:**

```typescript
// 安全: Prismaが自動的にエスケープ
const user = await prisma.user.findUnique({
  where: { email: userInput }
})

// 危険: 生SQLは避ける
// await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`
```

---

## CSRF対策

### SameSite Cookie

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    experimental: {
      cookies: {
        sameSite: 'strict',
        secure: true,
        httpOnly: true
      }
    }
  }
})
```

### CSRFトークン

```typescript
// server/middleware/csrf.ts
import { randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    const csrfToken = getCookie(event, 'csrf-token')
    const headerToken = getHeader(event, 'x-csrf-token')

    if (!csrfToken || csrfToken !== headerToken) {
      throw createError({
        statusCode: 403,
        message: 'Invalid CSRF token'
      })
    }
  }
})

// トークン生成
export const generateCsrfToken = () => {
  return randomBytes(32).toString('hex')
}
```

---

## CORS設定

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS,
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Access-Control-Max-Age': '86400'
        }
      }
    }
  }
})
```

---

## レート制限

### APIレート制限

```typescript
// server/middleware/rate-limit.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

const RATE_LIMIT = {
  auth: { limit: 10, window: 60 }, // 10回/分
  write: { limit: 100, window: 3600 }, // 100回/時間
  realtime: { limit: 1000, window: 3600 }, // 1000回/時間
  default: { limit: 300, window: 300 } // 300回/5分
}

export default defineEventHandler(async (event) => {
  const ip = getHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress
  const endpoint = event.path

  // エンドポイントに応じた制限値を取得
  const limit = RATE_LIMIT[endpoint.split('/')[2]] || RATE_LIMIT.default

  const key = `rate_limit:${ip}:${endpoint}`
  const current = await redis.incr(key)

  if (current === 1) {
    await redis.expire(key, limit.window)
  }

  if (current > limit.limit) {
    throw createError({
      statusCode: 429,
      message: 'Too many requests'
    })
  }

  // レスポンスヘッダー設定
  setHeader(event, 'X-RateLimit-Limit', limit.limit.toString())
  setHeader(event, 'X-RateLimit-Remaining', (limit.limit - current).toString())
})
```

---

## ファイルアップロード

### 画像アップロードのセキュリティ

**検証項目:**
1. ファイルタイプ検証
2. ファイルサイズ制限
3. ファイル名のサニタイゼーション
4. ウイルススキャン (オプション)

**実装例:**

```typescript
// server/api/upload/avatar.post.ts
import { randomUUID } from 'crypto'
import sharp from 'sharp'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const file = form?.find(item => item.name === 'avatar')

  if (!file) {
    throw createError({
      statusCode: 400,
      message: 'No file uploaded'
    })
  }

  // ファイルタイプ検証
  if (!ALLOWED_TYPES.includes(file.type || '')) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file type'
    })
  }

  // ファイルサイズ検証
  if (file.data.length > MAX_SIZE) {
    throw createError({
      statusCode: 400,
      message: 'File too large'
    })
  }

  // 画像処理 (リサイズ・最適化)
  const processedImage = await sharp(file.data)
    .resize(500, 500, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toBuffer()

  // S3にアップロード
  const key = `avatars/${randomUUID()}.jpg`
  await uploadToS3(key, processedImage)

  return { url: `https://cdn.example.com/${key}` }
})
```

---

## セッション管理

### セッションの保護

**Redis セッションストア:**

```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export const createSession = async (userId: string) => {
  const sessionId = randomUUID()
  await redis.setex(
    `session:${sessionId}`,
    86400, // 24時間
    JSON.stringify({ userId, createdAt: Date.now() })
  )
  return sessionId
}

export const getSession = async (sessionId: string) => {
  const data = await redis.get(`session:${sessionId}`)
  return data ? JSON.parse(data) : null
}

export const destroySession = async (sessionId: string) => {
  await redis.del(`session:${sessionId}`)
}
```

---

## 監査ログ

### ログ記録項目

- ユーザーID
- アクション (作成/更新/削除)
- リソース種別
- IPアドレス
- タイムスタンプ
- 変更前後の値 (機密情報を除く)

**実装例:**

```typescript
// server/utils/audit-log.ts
interface AuditLog {
  userId: string
  action: string
  resource: string
  resourceId: string
  ipAddress: string
  timestamp: Date
  metadata?: Record<string, any>
}

export const logAudit = async (log: AuditLog) => {
  await prisma.auditLog.create({
    data: log
  })

  // 重要なアクションはSlackに通知
  if (['user_delete', 'admin_action'].includes(log.action)) {
    await notifySlack(log)
  }
}

// 使用例
export default defineEventHandler(async (event) => {
  const user = event.context.user

  // 処理実行

  await logAudit({
    userId: user.uid,
    action: 'profile_update',
    resource: 'profile',
    resourceId: profileId,
    ipAddress: getHeader(event, 'x-forwarded-for'),
    timestamp: new Date()
  })
})
```

---

## コンテンツモデレーション

### 不適切コンテンツの検出

**AI モデレーション:**

```typescript
// server/utils/moderation.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export const moderateContent = async (content: string) => {
  const message = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 100,
    messages: [{
      role: 'user',
      content: `以下のコンテンツが不適切かどうか判定してください。不適切な場合は理由を簡潔に説明してください。\n\n${content}`
    }]
  })

  // 判定結果をパース
  const result = message.content[0].text
  const isInappropriate = result.includes('不適切')

  return {
    safe: !isInappropriate,
    reason: isInappropriate ? result : null
  }
}

// 使用例
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const moderation = await moderateContent(body.content)

  if (!moderation.safe) {
    throw createError({
      statusCode: 400,
      message: 'Inappropriate content detected',
      data: { reason: moderation.reason }
    })
  }

  // 処理続行
})
```

---

## 通報・ブロック機能

### ユーザー通報

```typescript
// server/api/reports.post.ts
export default defineEventHandler(async (event) => {
  const user = event.context.user
  const body = await readBody(event)

  const report = await prisma.report.create({
    data: {
      reporterId: user.uid,
      reportedUserId: body.reportedUserId,
      reason: body.reason,
      description: body.description,
      status: 'pending'
    }
  })

  // モデレーターに通知
  await notifyModerators(report)

  return report
})
```

### ブロック機能

```typescript
// server/api/blocks.post.ts
export default defineEventHandler(async (event) => {
  const user = event.context.user
  const body = await readBody(event)

  // ブロック作成
  const block = await prisma.block.create({
    data: {
      blockerId: user.uid,
      blockedId: body.blockedUserId,
      reason: body.reason
    }
  })

  // 既存のリレーションを無効化
  await prisma.userRelation.updateMany({
    where: {
      OR: [
        { userId: user.uid, targetUserId: body.blockedUserId },
        { userId: body.blockedUserId, targetUserId: user.uid }
      ]
    },
    data: { active: false }
  })

  return block
})
```

---

## HTTPS強制

### Vercel設定

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

---

## セキュリティヘッダー

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'geolocation=(self), microphone=()',
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "connect-src 'self' https://api.example.com",
            "font-src 'self'",
            "frame-ancestors 'none'"
          ].join('; ')
        }
      }
    }
  }
})
```

---

## 脆弱性スキャン

### 依存関係のスキャン

```bash
# npm audit
npm audit

# 自動修正
npm audit fix

# Snyk
npx snyk test
```

### 定期スキャン

GitHub Dependabotを有効化して自動的に脆弱性を検出

---

## インシデント対応

### 対応フロー

1. **検知**: 監視システムからアラート
2. **初動対応**: 影響範囲の特定、サービス停止判断
3. **調査**: ログ分析、原因特定
4. **対処**: 修正、パッチ適用
5. **復旧**: サービス再開
6. **報告**: 影響を受けたユーザーへの通知
7. **事後対策**: 再発防止策の実施

### 連絡体制

- オンコール担当者: Slack通知
- 重大インシデント: メール + 電話
- ユーザー通知: アプリ内通知 + メール

---

## セキュリティチェックリスト

- [ ] Firebase Authenticationの実装
- [ ] HTTPS強制
- [ ] CSRFトークン実装
- [ ] CORS設定
- [ ] XSS対策 (サニタイゼーション)
- [ ] SQLインジェクション対策 (ORM使用)
- [ ] レート制限実装
- [ ] セキュリティヘッダー設定
- [ ] ファイルアップロード検証
- [ ] 個人情報の暗号化
- [ ] 監査ログ実装
- [ ] 通報・ブロック機能実装
- [ ] 定期的な脆弱性スキャン
- [ ] インシデント対応手順の整備
