# Plans

計画を管理するためのディレクトリです。

## 使い方

### 新しい計画を作成する

1. `_template` フォルダをコピー
2. フォルダ名を計画名にリネーム
3. `plan.md` 内のプレースホルダーを埋める

```bash
# 例: user-authentication という計画を作成
cp -r _template user-authentication
```

### 命名規則

- フォルダ名はケバブケースを使用
- 例: `user-authentication`, `api-redesign`, `performance-optimization`

## ディレクトリ構成

```
plans/
├── README.md          # このファイル
├── _template/         # テンプレート（コピー用）
│   └── plan.md
└── [計画名]/          # 各計画フォルダ
    └── plan.md
```

## ステータス一覧

| ステータス | 説明 |
|-----------|------|
| 未着手 | 計画作成済み、作業未開始 |
| 進行中 | 作業中 |
| 完了 | 全タスク完了 |
| 保留 | 一時停止中 |
| 中止 | 計画中止 |
