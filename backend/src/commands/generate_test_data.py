import typer

generate_subcommand = typer.Typer()


@generate_subcommand.command()
def env_values():
    # 過去12時間分のenv_valuesレコードを生成する
    # DB操作の処理は後で適当な場所に移動する
    import random
    from datetime import datetime, timedelta

    from pytz import timezone

    from src.database import Session
    from src.models.env_value import EnvValue

    # INSERTするデータを作成
    twelve_hours_ago = datetime.now(timezone("UTC")) - timedelta(hours=12)
    insert_records = []
    for i in range(720):
        v = EnvValue(
            temperature=round(random.uniform(0, 50), 1),
            humidity=round(random.uniform(0, 100), 1),
            co2="%d" % int(random.uniform(400, 1500)),
            created_at=twelve_hours_ago + timedelta(minutes=i),
        )
        insert_records.append(v)

    with Session() as session:
        query = session.query(EnvValue)
        query.delete()

        # データ挿入
        session.add_all(insert_records)
        session.commit()


def register_cli(cli: typer.Typer):
    cli.add_typer(generate_subcommand, name="generate")
