FROM node:18-bookworm

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .
RUN rm .env.local || true

RUN npm run build

