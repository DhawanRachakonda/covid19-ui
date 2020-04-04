FROM node:latest AS build

ENV REACT_APP_GET_INFECTED_LIST=http://localhost:3003/api/v1/ic-tracker/infected-areas

WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]