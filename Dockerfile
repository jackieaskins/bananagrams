FROM node:12-alpine
WORKDIR /user/src/app

ENV PORT=3000

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
