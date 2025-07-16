from abc import ABC, abstractmethod

from ..entities.env_value import EnvValue


class EnvValueRepository(ABC):
    @abstractmethod
    def get_last_n_hours_data(self, n: int) -> list[EnvValue]:
        pass
