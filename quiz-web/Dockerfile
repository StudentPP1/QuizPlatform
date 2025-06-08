FROM node:slim

WORKDIR /quiz-api

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

EXPOSE 5173

CMD ["yarn", "dev"]