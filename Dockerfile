FROM node:14

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install

EXPOSE 41952

CMD ["npm", "run", "start"]