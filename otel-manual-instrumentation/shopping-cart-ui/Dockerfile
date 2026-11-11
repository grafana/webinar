FROM node:22-alpine@sha256:8af05ed9012b24a9205075889b231b65b47f8cc299f3034de2b8a864780ee07f
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
