FROM nginx
RUN apt update
RUN apt -y install nodejs npm
WORKDIR /app
RUN npm run build-js
COPY public /usr/share/nginx/html