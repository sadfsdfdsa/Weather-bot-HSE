FROM node:12
ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm install && npm install typescript -g

RUN npm run build:release

CMD npm run start
