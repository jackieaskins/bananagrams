FROM node:12-alpine
WORKDIR /user/src/app

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

EXPOSE 5000

CMD ["npm", "start"]
