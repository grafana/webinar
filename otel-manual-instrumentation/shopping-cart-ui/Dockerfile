FROM node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
