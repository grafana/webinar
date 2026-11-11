FROM node:22-alpine@sha256:5b05da3f938f1c604b24c633646d48805a6667f378cb4908438616f3cc48a0bf
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
