FROM node:26-alpine@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
