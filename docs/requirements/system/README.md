# システム要件

プロジェクト固有のシステムアーキテクチャ・技術要件を定義します。

---

## 概要

本アプリケーションは、AIエージェントによる業務自動化を実現するワークフローシステムです。
n8nのようなビジュアルフローエディタとAIによる自律的なタスク実行を組み合わせています。

### 設計原則

```
┌─────────────────────────────────────────────────────────┐
│                      Flow（基底型）                       │
│  ・すべての実行可能要素の基底                              │
│  ・再帰的な構造（子Flowを持てる）                          │
│  ・直列/並列実行モード                                    │
│  ・入出力定義、変数、完了条件                              │
└─────────────────────────────────────────────────────────┘
         ↑           ↑           ↑           ↑
    ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐
    │  Tool   │ │  Todo   │ │  Agent  │ │ Trigger │
    │(ツール) │ │(タスク) │ │(AI実行) │ │(起動条件)│
    └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

**重要**: Tool、Todo、Agent、Triggerすべてが**Flow型を継承**する。これにより：

- 統一的なデータ構造
- 再帰的な組み合わせが可能
- 一貫した実行インターフェース

---

## ドキュメント構成

| ファイル | 内容 |
|---------|------|
| [core-types.md](./core-types.md) | コア型定義（Flow, Tool, Agent, Todo, Trigger） |
| [execution-engine.md](./execution-engine.md) | 実行エンジン設計 |
| [database.md](./database.md) | データベース設計（LowDB） |
| [builtin-tools.md](./builtin-tools.md) | ビルトインツール一覧 |
| [api.md](./api.md) | API設計（REST/WebSocket） |

---

## 技術スタック

| レイヤー | 技術 | 備考 |
|---------|------|------|
| フロントエンド | Nuxt3, TailwindCSS, Pinia | - |
| フローエディタ | Vue Flow | ノードベースUI |
| AI | OpenAI API / Claude API / ローカルLLM | 切り替え可能 |
| バックエンド | Nuxt Server Routes (Nitro) | - |
| データベース | LowDB（JSONベース） | 軽量・ローカル |
| ファイル管理 | サーバーローカル + DB管理 | - |
| キュー | Bull / BullMQ | 並列実行用 |

---

## 関連ドキュメント

- [機能要件](../features/README.md) - 画面・機能単位の要件
- [汎用アーキテクチャ](../../development/architecture/system-design.md) - Nuxt3/Nitro等の汎用設計
- [開発ガイド](../../development/development-guide.md) - 開発プロセス
