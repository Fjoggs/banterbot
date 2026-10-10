# First image for compiling typescript
FROM node:26-alpine as build-deps

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Bundle app source
COPY . ./

# Compile typescript
RUN npm run build

# Install needed dependencies for running server
RUN npm ci --omit=dev

CMD [ "node", "dist/bot/bot.js" ]
