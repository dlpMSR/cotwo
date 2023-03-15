FROM python:3.9.16

ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
RUN pip install --upgrade pip
ADD ./daemon/requirements.txt /code/
RUN pip install -r requirements.txt
