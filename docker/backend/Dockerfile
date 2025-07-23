FROM python:3.11.13

ENV PYTHONUNBUFFERED=1

WORKDIR /code

RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:${PATH}"

COPY ./backend/pyproject.toml ./
COPY ./backend/poetry.lock ./
RUN poetry config virtualenvs.in-project true
RUN poetry self update
RUN poetry install --no-root

CMD ["poetry", "run", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8001"]
