FROM node:21-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


RUN addgroup -g 1001 user &&\
  adduser -D -u 1001 -G user user

COPY wait-for-db.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/wait-for-db.sh

RUN mkdir -p ./data &&\
  chown -R user:user ./data &&\
  chmod -R 777 ./data/

CMD ["sh","/usr/local/bin/wait-for-db.sh","npm", "run", "start:dev"]



