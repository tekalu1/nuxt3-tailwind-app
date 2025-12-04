# デプロイ戦略

## 環境構成

### 環境一覧

| 環境 | 用途 | ブランチ | URL |
|------|------|---------|-----|
| ローカル | 開発 | - | http://localhost:3000 |
| ステージング | テスト・検証 | `develop` | https://staging.example.com |
| 本番 | 本番サービス | `main` | https://example.com |

---

## ホスティング

### Vercel (推奨)

**選定理由:**
- Nuxt3との統合が優れている
- 自動スケーリング
- グローバルCDN
- 簡単なデプロイ
- プレビュー環境の自動生成

**設定:**

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nuxtjs",
  "regions": ["hnd1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "REDIS_URL": "@redis-url",
    "FIREBASE_PRIVATE_KEY": "@firebase-private-key"
  }
}
```

### AWS (代替案)

**構成:**
- **EC2**: アプリケーションサーバー
- **RDS**: PostgreSQL
- **ElastiCache**: Redis
- **S3 + CloudFront**: 静的アセット配信
- **ALB**: ロードバランサー

---

## データベース

### PostgreSQL (RDS)

**ステージング環境:**
```
インスタンス: db.t3.micro
ストレージ: 20GB
Multi-AZ: 無効
バックアップ: 7日間保持
```

**本番環境:**
```
インスタンス: db.t3.medium (初期) → 必要に応じてスケール
ストレージ: 100GB
Multi-AZ: 有効
バックアップ: 30日間保持
ポイントインタイムリカバリ: 有効
暗号化: 有効
```

### マイグレーション戦略

```bash
# ステージング環境へのマイグレーション
DATABASE_URL=$STAGING_DATABASE_URL npx prisma migrate deploy

# 本番環境へのマイグレーション
DATABASE_URL=$PRODUCTION_DATABASE_URL npx prisma migrate deploy
```

**マイグレーション手順:**
1. ステージング環境でテスト
2. データベースバックアップ
3. メンテナンスモード ON
4. マイグレーション実行
5. 動作確認
6. メンテナンスモード OFF

---

## キャッシュ層

### Redis (ElastiCache)

**ステージング環境:**
```
ノードタイプ: cache.t3.micro
レプリケーション: なし
```

**本番環境:**
```
ノードタイプ: cache.t3.medium
レプリケーション: 2ノード
自動フェイルオーバー: 有効
暗号化: 有効
```

---

## CI/CD パイプライン

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: [lint, type-check, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .output

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel Staging
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

  e2e-test:
    needs: deploy-staging
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: https://staging.example.com
```

---

## デプロイフロー

### ブランチ戦略 (Git Flow)

```
main (本番)
  │
  ├─ develop (ステージング)
  │    │
  │    ├─ feature/user-profile
  │    ├─ feature/new-feature
  │    └─ bugfix/ui-issue
  │
  └─ hotfix/critical-bug
```

### デプロイ手順

#### ステージング環境

```bash
# 1. feature ブランチで開発
git checkout -b feature/new-feature develop

# 2. 開発・テスト
git add .
git commit -m "feat: add new feature"

# 3. developにマージ
git checkout develop
git merge feature/new-feature

# 4. プッシュ (自動デプロイ)
git push origin develop
```

#### 本番環境

```bash
# 1. developから main にプルリクエスト作成

# 2. レビュー・承認

# 3. マージ (自動デプロイ)
git checkout main
git merge develop
git push origin main
```

---

## 環境変数管理

### Vercel

**設定方法:**

```bash
# 本番環境
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
vercel env add FIREBASE_PRIVATE_KEY production

# ステージング環境
vercel env add DATABASE_URL preview
vercel env add REDIS_URL preview
vercel env add FIREBASE_PRIVATE_KEY preview
```

### ローカル開発

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"
REDIS_URL="redis://localhost:6379"
FIREBASE_API_KEY="..."
FIREBASE_PRIVATE_KEY="..."
```

**重要: `.env` は `.gitignore` に含める**

---

## ロールバック戦略

### Vercel

```bash
# デプロイ履歴確認
vercel ls

# 特定のデプロイに戻す
vercel rollback <deployment-url>
```

### データベース

```bash
# RDSスナップショットから復元
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier myapp-restored \
  --db-snapshot-identifier myapp-snapshot-2025-10-18
```

---

## 監視・アラート

### Vercel Analytics

- ページビュー
- パフォーマンスメトリクス
- エラー率

### Sentry (エラー監視)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sentry'],
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
  }
})
```

### CloudWatch (AWS)

- RDS メトリクス
- ElastiCache メトリクス
- ALB メトリクス

### アラート設定

| メトリクス | 閾値 | アクション |
|----------|------|----------|
| エラー率 | > 5% | Slack通知 |
| レスポンスタイム | > 3秒 | Slack通知 |
| CPU使用率 | > 80% | Slack通知 + オートスケール |
| データベース接続 | > 80% | 緊急Slack通知 |
| ディスク使用率 | > 85% | 緊急Slack通知 |

---

## スケーリング戦略

### 水平スケーリング

**Vercel:**
- 自動スケーリング (設定不要)
- リクエストに応じて自動的にインスタンス増減

**RDS:**
```bash
# Read Replica追加
aws rds create-db-instance-read-replica \
  --db-instance-identifier myapp-read-replica \
  --source-db-instance-identifier myapp-primary
```

**Redis:**
```bash
# ノード追加 (Cluster Mode)
aws elasticache modify-replication-group \
  --replication-group-id myapp-redis \
  --replica-count 3
```

### 垂直スケーリング

**RDS:**
```bash
# インスタンスタイプ変更
aws rds modify-db-instance \
  --db-instance-identifier myapp \
  --db-instance-class db.t3.large \
  --apply-immediately
```

---

## バックアップ戦略

### データベース

**自動バックアップ:**
- RDS自動バックアップ: 毎日3:00 AM (JST)
- 保持期間: 30日間

**手動スナップショット:**
```bash
# スナップショット作成
aws rds create-db-snapshot \
  --db-instance-identifier myapp \
  --db-snapshot-identifier myapp-manual-$(date +%Y%m%d)
```

### 画像ファイル

**S3バージョニング:**
- バケットバージョニング有効化
- ライフサイクルポリシー: 90日後にGlacierへ移行

---

## ディザスタリカバリ

### RTO/RPO目標

| 目標 | 値 |
|------|---|
| RTO (復旧時間目標) | 4時間 |
| RPO (データ損失目標) | 1時間 |

### 復旧手順

1. **データベース復旧**
   - 最新のスナップショットから復元
   - ポイントインタイムリカバリ実行

2. **アプリケーション復旧**
   - Vercelの前バージョンにロールバック
   - または GitHub から再デプロイ

3. **動作確認**
   - 疎通確認
   - 主要機能のテスト

4. **サービス再開**
   - ステータスページ更新
   - ユーザーへの通知

---

## デプロイチェックリスト

### デプロイ前

- [ ] すべてのテストが通過
- [ ] Lintエラーなし
- [ ] Type Checkエラーなし
- [ ] ステージング環境で動作確認
- [ ] マイグレーションスクリプト確認
- [ ] 環境変数の設定確認
- [ ] データベースバックアップ作成

### デプロイ中

- [ ] メンテナンスモード ON (必要に応じて)
- [ ] マイグレーション実行
- [ ] アプリケーションデプロイ
- [ ] 疎通確認

### デプロイ後

- [ ] 主要機能の動作確認
- [ ] エラー監視
- [ ] パフォーマンス監視
- [ ] ユーザーからのフィードバック確認
- [ ] メンテナンスモード OFF

---

## パフォーマンス最適化

### CDN設定

**CloudFront (AWS):**
```json
{
  "origins": [
    {
      "domainName": "myapp.vercel.app",
      "originPath": "",
      "customHeaders": []
    }
  ],
  "cacheBehaviors": [
    {
      "pathPattern": "/_nuxt/*",
      "cachePolicyId": "CachingOptimized",
      "compress": true
    },
    {
      "pathPattern": "/images/*",
      "cachePolicyId": "CachingOptimized",
      "compress": true
    }
  ]
}
```

### キャッシュ戦略

| リソース | キャッシュ場所 | TTL |
|---------|--------------|-----|
| 静的アセット | CloudFront | 1年 |
| APIレスポンス | Redis | 1-60分 |
| ページHTML | なし | - |
| 画像 | S3 + CloudFront | 1年 |

---

## コスト見積もり

### 初期 (月間1000ユーザー)

| サービス | 料金 |
|---------|------|
| Vercel (Hobby) | $0 |
| RDS (db.t3.micro) | $15 |
| ElastiCache (cache.t3.micro) | $10 |
| S3 (10GB) | $0.3 |
| CloudFront | $5 |
| Firebase Auth | $0 (無料枠) |
| **合計** | **$30** |

### 成長期 (月間10000ユーザー)

| サービス | 料金 |
|---------|------|
| Vercel (Pro) | $20 |
| RDS (db.t3.medium Multi-AZ) | $120 |
| ElastiCache (cache.t3.medium) | $50 |
| S3 (100GB) | $3 |
| CloudFront | $30 |
| Firebase Auth | $0 (無料枠) |
| Sentry | $26 |
| **合計** | **$249** |

---

## セキュリティ

### SSL/TLS証明書

- Vercel: 自動発行・更新
- カスタムドメイン: Let's Encrypt

### ファイアウォール

- Vercel: DDoS保護標準装備
- AWS WAF: 必要に応じて導入

---

## ドキュメント

### デプロイログ

すべてのデプロイ情報を記録:
- デプロイ日時
- デプロイ者
- 変更内容
- 成功/失敗
- ロールバック履歴

### ランブック

運用手順書:
- デプロイ手順
- トラブルシューティング
- エスカレーションフロー
- 緊急連絡先
