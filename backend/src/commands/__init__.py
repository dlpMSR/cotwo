import typer

from . import generate_test_data


def init_cli(cli: typer.Typer):
    generate_test_data.register_cli(cli)
