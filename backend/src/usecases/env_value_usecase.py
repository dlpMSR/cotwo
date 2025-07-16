from src.entities.env_value import EnvValue
from src.repositories.env_value_repository import EnvValueRepository


class EnvValueUsecase:
    def __init__(self, env_value_repository: EnvValueRepository):
        self.env_value_repository = env_value_repository

    def get_last_12_hours_records(self) -> list[EnvValue]:
        return self.env_value_repository.get_last_n_hours_data(n=12)
