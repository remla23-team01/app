FROM nginx
WORKDIR /root
ENV HOST_URL = "http://localhost:8080"
ENV MY_APP_URL = "http://localhost:8080"
RUN apt update
RUN apt -y install nodejs npm
COPY ./public /root/public
COPY ./src /root/src
RUN cat ./src/env-deploy.json >| ./src/env.json
COPY nginx.conf /etc/nginx/nginx.conf
COPY package.json /root
RUN ls
RUN npm install
RUN npm run build-js
RUN mv public/* /usr/share/nginx/html