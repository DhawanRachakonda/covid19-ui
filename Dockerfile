FROM node:latest AS build

ENV REACT_APP_GET_USER=http://localhost:3003/api/v1/user
ENV REACT_APP_POST_USER=http://localhost:3003/api/v1/user
ENV REACT_APP_LOGIN_USER=http://localhost:3003/api/v1/login

ENV REACT_APP_GET_DOCS=http://localhost:3003/api/v1/docs
ENV REACT_APP_POST_DOC=http://localhost:3003/api/v1/docs

WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]