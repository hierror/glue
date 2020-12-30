FROM node:14

RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list \
    apt update \
    apt install -y mongodb-org \
    systemctl start mongod \
    systemctl enable mongod

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install

EXPOSE 80

CMD ["npm", "run", "start"]