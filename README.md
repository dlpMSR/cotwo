# cotwo

室内環境パラメータを見られるようにするWebアプリケーション  
since Mar. 2023

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
