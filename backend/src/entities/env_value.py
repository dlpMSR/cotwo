from datetime import datetime

from src.models.env_value import EnvValue as EnvValueModel


class EnvValue:
    temperature: float
    humidity: float
    co2: int
    timestamp: datetime

    def __init__(self, temperature, humidity, co2, timestamp):
        self.temperature = temperature
        self.humidity = humidity
        self.co2 = co2

        if isinstance(timestamp, datetime):
            self.timestamp = timestamp
        elif isinstance(timestamp, str):
            self.timestamp = datetime.fromisoformat(timestamp)
        else:
            raise TypeError("Invalid type for 'timestamp': expected datetime or str.")

    @classmethod
    def from_model(cls, model: EnvValueModel) -> "EnvValue":
        return cls(
            temperature=model.temperature,
            humidity=model.humidity,
            co2=model.co2,
            timestamp=model.created_at,
        )
