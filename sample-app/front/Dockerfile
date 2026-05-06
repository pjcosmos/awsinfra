# 1. Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL


RUN npm run build

# 2. Production Stage (Nginx)
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# /api/* 요청을 backend-service:8080 으로 프록시하는 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
