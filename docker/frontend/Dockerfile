FROM node:lts-alpine

WORKDIR /code

RUN apk update && \
    npm install -g npm && \
    npm install -g vue-cli

CMD npm run serve
