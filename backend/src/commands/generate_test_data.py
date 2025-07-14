import typer

generate_subcommand = typer.Typer()


@generate_subcommand.command()
def env_values():
    print("gen12")


def register_cli(cli: typer.Typer):
    cli.add_typer(generate_subcommand, name="generate")
