FROM node:14

RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add - \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list \
    sudo apt update \
    sudo apt install -y mongodb-org \
    sudo systemctl start mongod \
    sudo systemctl enable mongod

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install

EXPOSE 80

CMD ["npm", "run", "start"]