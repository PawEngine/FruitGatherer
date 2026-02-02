# FruitGatherer AWSデプロイ手順書

このドキュメントでは、FruitGathererアプリケーション（Reactフロントエンド + FastAPIバックエンド）をAWSにデプロイし、公開する手順を説明します。

---

## 1. 準備するもの

- AWSアカウント
- GitHubリポジトリ（ソースコードを管理しているもの）
- ローカル環境にインストールされた Docker

---

## 2. バックエンドのデプロイ (AWS App Runner)

AWS App Runnerを使用すると、Dockerコンテナを簡単に公開できます。

### 手順:

1.  **AWSコンソール**で「App Runner」を開きます。
2.  「App Runner サービスの作成」をクリックします。
3.  「ソースコードリポジトリ」を選択し、GitHubリポジトリを連携します。
4.  **設定内容:**
    - **ランタイム:** Python 3.11 (または Dockerfile を使用)
    - **ビルドコマンド:** `pip install -r backend/requirements.txt`
    - **開始コマンド:** `python backend/main.py`
    - **ポート:** `8000`
5.  デプロイが完了すると、`https://xxxxpx.jp-northeast-1.awsapprunner.com` のようなURLが発行されます。**これをメモしてください。**

---

## 3. フロントエンドのデプロイ (AWS Amplify)

AWS Amplifyは、Vite+Reactプロジェクトを高速にデプロイ・ホストします。

### 手順:

1.  **AWSコンソール**で「AWS Amplify」を開きます。
2.  「新しいアプリを作成」から GitHub リポジトリ（Frontendコードが含まれるもの）を選択します。
3.  **ビルド設定:**
    - 基本的にはデフォルトのままでOKです（`npm run build` が実行されます）。
4.  **環境変数の設定 (重要):**
    - Amplifyの設定画面で「環境変数」を選択し、以下を追加します。
    - `VITE_API_BASE_URL` = (手順2でメモしたApp RunnerのURL)
5.  「保存してデプロイ」をクリックします。

---

## 4. 動作確認

1.  AWS Amplifyから発行されたフロントエンドのURL（`https://main.xxxx.amplifyapp.com`）にアクセスします。
2.  ゲームが起動し、バックエンドから「WORLD RANKING」が取得できているか確認します。
3.  実際にプレイし、ゲームオーバー時にスコアが保存されることを確認します。

---

## 注意事項

- **CORS設定:** `backend/main.py` の `allow_origins` に、AmplifyのURLを明示的に指定することをお勧めします（現在は `"*"` になっています）。
- **無料枠:** App Runnerなどは稼働時間に応じて料金が発生するため、使用しない場合はサービスを一時停止してください。
