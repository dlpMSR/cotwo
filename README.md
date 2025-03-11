# cotwo
室内環境パラメータを見られるようにするWebアプリケーション  
since Mar. 2023

<kbd><img width="320" alt="Screenshot 2025-03-11 at 22 05 15" src="https://github.com/user-attachments/assets/a3556ff0-2838-4d58-9577-83d703946528" /></kbd>

<kbd><img width="540" alt="Screenshot 2025-03-11 at 22 14 10" src="https://github.com/user-attachments/assets/2a85876e-ccdb-48c1-ac85-cdce94aba3a1" /></kbd>

研究室やオフィスの空気の監視に使って、どうぞ

## 環境構築
### システム構成
<kbd><img src="https://github.com/dlpMSR/cotwo/assets/11821107/cde3417e-a693-4705-a070-d0aa8bce5d86"></kbd>


### 開発者向け環境構築
dockerで仮想環境を作ることで、実機がなくても開発を進められます。

#### 各コンテナの立ち上げ
cotwoをクローンしたディレクトリで、次のコマンドを実行します。
```bash
docker compose up -d
```

#### バックエンドのテストの実行
次のコマンドで、バックエンドのコンテナに入ります。
```bash
docker compose exec backend bash
```

次に、次のコマンドでテストを実行します。
```bash
python manage.py test environment
```
