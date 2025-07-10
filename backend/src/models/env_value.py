from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column

from . import Base


class EnvValue(Base):
    __tablename__ = "env_value"

    id: Mapped[int] = mapped_column(primary_key=True)
    temperature: Mapped[float]
    humidity: Mapped[float]
    co2: Mapped[int]
    created_at: Mapped[datetime]
