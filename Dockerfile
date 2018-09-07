FROM mhart/alpine-node:10.7.0
WORKDIR /usr/src
COPY package.json .
COPY yarn.lock .
RUN yarn && yarn cache clean --force
COPY . .

# Run tests
RUN yarn test
RUN mkdir /public && echo "<marquee direction="right">All tests passed!</marquee>" > /public/index.html
