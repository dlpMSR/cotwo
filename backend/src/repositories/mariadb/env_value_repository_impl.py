from datetime import datetime, timedelta

from sqlalchemy import desc

from src.entities.env_value import EnvValue as EnvValueEntity
from src.models import Session
from src.models.env_value import EnvValue as EnvValueModel
from src.repositories.env_value_repository import EnvValueRepository


class EnvValueRepositoryImpl(EnvValueRepository):
    def get_last_n_hours_data(self, n: int):
        if not isinstance(n, int):
            raise TypeError("Input n must be an integer.")

        if n < 0:
            raise ValueError("Input n must be greater than zero.")

        n_hours_ago = datetime.now() - timedelta(hours=n)
        with Session() as session:
            query = (
                session.query(EnvValueModel)
                .filter(EnvValueModel.created_at > n_hours_ago)
                .order_by(desc(EnvValueModel.created_at))
            )
            result = query.all()

        return [EnvValueEntity.from_model(item) for item in result]
