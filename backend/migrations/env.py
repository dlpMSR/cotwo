import importlib
import os
import pkgutil
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from dotenv import load_dotenv
from src.models import Base, engine

# migrationファイルの自動生成のため、src.models以下のmodelファイルを全て読み込む
models_dir = Path(__file__).resolve().parent.parent / "src/models"
for _, module_name, _ in pkgutil.iter_modules([models_dir]):
    importlib.import_module(f"src.models.{module_name}")

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.``


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    config.set_section_option("alembic", "DB_USER", os.environ.get("DB_USER"))
    config.set_section_option("alembic", "DB_PASSWORD", os.environ.get("DB_PASSWORD"))
    config.set_section_option("alembic", "DB_HOST", os.environ.get("DB_HOST"))
    config.set_section_option("alembic", "DB_NAME", os.environ.get("DB_NAME"))
    config.set_section_option("alembic", "DB_PORT", os.environ.get("DB_PORT"))

    url = config.get_main_option("sqlalchemy.url")
    connectable = engine

    with connectable.connect() as connection:
        context.configure(
            url=url,
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
