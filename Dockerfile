FROM node:current-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8080 9091
CMD [ "npm", "start" ]
