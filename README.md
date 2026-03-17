# todo

シンプルな ToDo 管理 Web アプリケーション。

タスクの作成・編集・削除・完了管理を行い、カテゴリ・優先度・期限による整理と、SSE によるリアルタイムな状態同期を提供します。

## 技術スタック

| 領域               | 技術                          |
| ------------------ | ----------------------------- |
| 言語               | TypeScript                    |
| フロントエンド     | React 19 + Vite               |
| バックエンド       | Express 5 (Node.js)           |
| データベース       | PostgreSQL 16 + Prisma        |
| リアルタイム通信   | SSE (Server-Sent Events)      |
| パッケージ管理     | npm workspaces                |
| テスト             | Vitest                        |
| コード品質         | ESLint + Prettier             |

## 前提条件

- **Node.js 22** — [mise](https://mise.jdx.dev/) で管理
- **Docker** — PostgreSQL の起動に使用

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/turntuptechnologies-ai/todo.git
cd todo

# mise でランタイムを有効化
eval "$(mise activate bash)"

# 依存パッケージをインストール
npm install

# PostgreSQL を起動
docker compose up -d

# 環境変数ファイルをコピー
cp packages/server/.env.example packages/server/.env

# Prisma マイグレーションを実行
npm run db:migrate

# 開発サーバーを起動
npm run dev
```

起動後、クライアントは http://localhost:5173 、サーバーは http://localhost:3001 でアクセスできます。

## 開発コマンド

| コマンド               | 説明                                     |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | サーバーとクライアントを同時に起動       |
| `npm run dev:server`   | サーバーのみ起動                         |
| `npm run dev:client`   | クライアントのみ起動                     |
| `npm run build`        | 全パッケージをビルド                     |
| `npm test`             | 全パッケージのテストを実行               |
| `npm run lint`         | 全パッケージの ESLint を実行             |
| `npm run format`       | Prettier でコードをフォーマット          |
| `npm run format:check` | フォーマットのチェックのみ               |
| `npm run db:migrate`   | Prisma マイグレーションを実行            |
| `npm run db:generate`  | Prisma Client を再生成                   |
| `npm run docker:up`    | PostgreSQL コンテナを起動                |
| `npm run docker:down`  | PostgreSQL コンテナを停止                |

## ディレクトリ構成

```
todo/
├── packages/
│   ├── server/          # バックエンド (Express + Prisma)
│   │   ├── src/
│   │   │   ├── routes/      # API ルート定義
│   │   │   ├── errors/      # カスタムエラークラス
│   │   │   ├── lib/         # ユーティリティ (Prisma クライアント等)
│   │   │   └── middleware/  # エラーハンドリング等
│   │   └── prisma/          # スキーマ・マイグレーション
│   ├── client/          # フロントエンド (React + Vite)
│   │   └── src/
│   └── shared/          # 共有型定義
│       └── src/types/
├── docker-compose.yaml  # PostgreSQL コンテナ定義
├── tsconfig.base.json   # TypeScript 共通設定
└── package.json         # ワークスペースルート
```

## API エンドポイント

すべてのエンドポイントは `/api` プレフィックス付きです。

### ヘルスチェック

| メソッド | パス          | 説明               |
| -------- | ------------- | ------------------ |
| GET      | `/api/health` | サーバー稼働確認   |

### タスク

| メソッド | パス              | 説明               |
| -------- | ----------------- | ------------------ |
| GET      | `/api/tasks`      | タスク一覧を取得   |
| GET      | `/api/tasks/:id`  | タスク詳細を取得   |
| POST     | `/api/tasks`      | タスクを作成       |
| PATCH    | `/api/tasks/:id`  | タスクを更新       |
| DELETE   | `/api/tasks/:id`  | タスクを削除       |

### カテゴリ

| メソッド | パス                   | 説明                 |
| -------- | ---------------------- | -------------------- |
| GET      | `/api/categories`      | カテゴリ一覧を取得   |
| POST     | `/api/categories`      | カテゴリを作成       |
| PATCH    | `/api/categories/:id`  | カテゴリを更新       |
| DELETE   | `/api/categories/:id`  | カテゴリを削除       |

### SSE (リアルタイム通信)

| メソッド | パス              | 説明                           |
| -------- | ----------------- | ------------------------------ |
| GET      | `/api/sse/tasks`  | タスク変更のリアルタイム通知   |

SSE イベント種別: `connected`, `task:created`, `task:updated`, `task:deleted`, `heartbeat`

## ライセンス

Private
