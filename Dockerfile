# Dockerfile
# 1st Stage
FROM node:18.16.0-alpine AS builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn install --ignore-platform
COPY . .
RUN yarn build

# 2nd Stage
FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d
COPY nginx.conf /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]