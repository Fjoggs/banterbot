# First image for compiling typescript
FROM node:current-alpine as build-deps

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn

# Bundle app source
COPY . ./

# Compile typescript
#RUN yarn build

# Install needed dependencies for running server
RUN yarn install --production


# defined in package.json
CMD [ "yarn", "bot" ]
