# Development stage
FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS build
COPY . .
RUN yarn build

FROM base AS development
ENV NODE_ENV=development
WORKDIR /usr/src/app

COPY . .

CMD ["yarn", "start:dev"]

# Production stage
FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./

CMD ["yarn", "start:prod"]