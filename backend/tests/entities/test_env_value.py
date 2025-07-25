import pytest
from src.entities.env_value import EnvValue


def test_timestampにISO8601形式以外の文字列を入力して初期化すると例外が発生すること():
    with pytest.raises(ValueError):
        EnvValue(
            temperature=24.0,
            humidity=59.1,
            co2=1028,
            timestamp="2025/07/25 15:39:21",
        )
