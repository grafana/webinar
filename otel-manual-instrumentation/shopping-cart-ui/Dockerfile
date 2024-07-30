FROM node:17-alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"] 