FROM nginx
RUN apt update
RUN apt install nodejs
RUN npm run build-js
COPY public /usr/share/nginx/html