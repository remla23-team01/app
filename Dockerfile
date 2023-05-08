FROM nginx
RUN apt update
RUN apt -y install nodejs npm
RUN npm run build-js
COPY public /usr/share/nginx/html