FROM node:12 AS builder

# Install Yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Remove redundant folders
# RUN rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . /app
RUN yarn install
RUN NODE_ENV=production yarn build

# production environment
FROM rhezas8/nginx-static
RUN apk update && apk upgrade
COPY --from=builder /app/build /static
