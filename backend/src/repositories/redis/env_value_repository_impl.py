import json

from src.entities.env_value import EnvValue
from src.exceptions.custom_exceptions import LatestMeasurementUnavailableException
from src.redis import redis_client
from src.repositories.env_value_repository import EnvValueRepository


class EnvValueRepositoryImpl(EnvValueRepository):
    def get_latest(self) -> EnvValue:
        try:
            result: str = redis_client.get("scd41:measurement")
            result_dict: dict = json.loads(result)
        except Exception as e:
            raise LatestMeasurementUnavailableException() from e

        return EnvValue(
            temperature=result_dict["temperature"],
            humidity=result_dict["humidity"],
            co2=result_dict["humidity"],
            timestamp=result_dict["timestamp"],
        )

    def get_last_n_hours_data(self, n):
        pass

    def save_all(self, data):
        pass

    def delete_all(self):
        pass
