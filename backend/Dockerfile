FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npx", "nodemon", "--watch", "src", "--ext", "ts", "--exec", "npm", "run", "start:dev"]

