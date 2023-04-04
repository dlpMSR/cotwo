FROM python:3.9.16

RUN apt-get update && apt-get install -y less supervisor
RUN mkdir -p /var/log/supervisor
ADD ./docker/backend/daphne.conf /etc/supervisor/conf.d/daphne.conf

ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
RUN pip install --upgrade pip
ADD ./backend/requirements.txt /code/
RUN pip install -r requirements.txt
