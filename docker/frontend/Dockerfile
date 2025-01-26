FROM node:lts-bullseye

WORKDIR /code

RUN apt update

COPY ./frontend/package.json /code/package.json

RUN cd /code && npm install

CMD cd /code && npm run dev
