from src.models.env_value import EnvValue as EnvValueModel


class EnvValue:
    def __init__(self, temperature, humidity, co2, timestamp):
        self.temperature = temperature
        self.humidity = humidity
        self.co2 = co2
        self.timestamp = timestamp

    @classmethod
    def from_model(cls, model: EnvValueModel) -> "EnvValue":
        return cls(
            temperature=model.temperature,
            humidity=model.humidity,
            co2=model.co2,
            timestamp=model.created_at,
        )
