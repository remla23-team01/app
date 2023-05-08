FROM nginx
WORKDIR /root
RUN apt update
RUN apt -y install nodejs npm
COPY ./public /root/public
COPY ./src /root/src
COPY package.json /root
RUN ls
RUN npm install
RUN npm run build-js
COPY public /usr/share/nginx/html