FROM node:16

WORKDIR /home/app

RUN npm i && npm run build

CMD ["npm", "run", "run:container:dev"]