FROM node:18-alpine as builder
EXPOSE 5000
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run db:generate
RUN npm run build

CMD ["npm", "run", "start:prod"]