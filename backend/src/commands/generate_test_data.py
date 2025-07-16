import random
from datetime import datetime, timedelta

import typer
from pytz import timezone

from src.entities.env_value import EnvValue
from src.repositories.mariadb.env_value_repository_impl import EnvValueRepositoryImpl
from src.usecases.env_value_usecase import EnvValueUsecase

generate_subcommand = typer.Typer()


@generate_subcommand.command()
def env_values():
    # 過去12時間分のenv_valuesレコードを生成して保存する
    twelve_hours_ago = datetime.now(timezone("UTC")) - timedelta(hours=12)
    insert_records = [
        EnvValue(
            temperature=round(random.uniform(0, 50), 1),
            humidity=round(random.uniform(0, 100), 1),
            co2="%d" % int(random.uniform(400, 1500)),
            timestamp=twelve_hours_ago + timedelta(minutes=i),
        )
        for i in range(720)
    ]

    env_value_repository = EnvValueRepositoryImpl()
    usecase = EnvValueUsecase(env_value_repository=env_value_repository)
    usecase.insert_test_records(insert_records)


def register_cli(cli: typer.Typer):
    cli.add_typer(generate_subcommand, name="generate")
