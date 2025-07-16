from abc import ABC, abstractmethod

from src.entities.env_value import EnvValue


class EnvValueRepository(ABC):
    @abstractmethod
    def get_last_n_hours_data(self, n: int) -> list[EnvValue]:
        pass

    @abstractmethod
    def save_all(self, data: list[EnvValue]) -> None:
        pass

    @abstractmethod
    def delete_all(self) -> None:
        pass
