FROM node:14-alpine as build-stage 
WORKDIR /client

COPY ./client /client
RUN npm install
RUN npm run build

FROM nginx:1.21.4-alpine as production-stage
RUN rm /etc/nginx/conf.d/default.conf
# COPY ./conf.d /etc/nginx/conf.d/
COPY --from=build-stage /client/build /var/www/html/groupware
CMD ["nginx", "-g", "daemon off;"]