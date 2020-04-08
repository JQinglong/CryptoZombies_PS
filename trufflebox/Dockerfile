FROM node:8-alpine  

RUN apk add --update alpine-sdk
RUN apk add --no-cache git python g++ make \
    && npm i -g --unsafe-perm=true --allow-root truffle 

WORKDIR /usr/src/app