FROM node:8.9.3-alpine
RUN mkdir -p /usr/src/app
RUN npm install
COPY ./app/* /usr/src/app/
WORKDIR /usr/src/app
EXPOSE 8080 9091
CMD node /usr/src/app/index.js
