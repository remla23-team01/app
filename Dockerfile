FROM nginx
WORKDIR /root
RUN apt update
RUN apt -y install nodejs npm
COPY ./public /root/public
COPY ./src /root/src
COPY package.json /root
COPY nginx.conf /etc/nginx/nginx.conf
RUN ls
RUN npm install
RUN npm run build-js
RUN mv public/* /usr/share/nginx/html