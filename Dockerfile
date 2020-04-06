FROM node:latest AS build

ENV REACT_APP_GET_INFECTED_LIST=http://localhost:3003/api/v1/ic-tracker/infected-areas
ENV REACT_APP_POST_SUSPECTION_DETAILS=https://incubationtracker.herokuapp.com/api/v1/ic-tracker/suspection-details
ENV REACT_APP_POST_AUTHENTICATE=http://localhost:3003/authenticate
ENV REACT_APP_POST_REGISTER=http://localhost:3003/register

WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]