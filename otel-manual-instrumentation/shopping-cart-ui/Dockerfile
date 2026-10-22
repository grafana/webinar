FROM node:22-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
