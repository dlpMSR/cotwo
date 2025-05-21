# cotwo
オフィスの空気を確認する

<kbd><img src="https://github.com/user-attachments/assets/1afd1573-2631-43dd-a476-5129ac9e0105" width="400"></kbd>


## 環境構築
### システム構成

<kbd><img width=750 src="https://github.com/user-attachments/assets/3dd77297-d10f-4243-8f92-ee7f3697556e"></kbd>


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
