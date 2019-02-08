FROM node:8.9.3-alpine
RUN mkdir -p /usr/src/app
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies
COPY ./app/* /usr/src/app/
WORKDIR /usr/src/app
EXPOSE 8080 9091
CMD node /usr/src/app/index.js
