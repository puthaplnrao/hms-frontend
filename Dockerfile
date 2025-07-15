# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app
COPY . .
# Accept build args
ARG REACT_APP_API_URL
ARG REACT_APP_ENV
ARG REACT_APP_NAME
# Inject them as ENV for React build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV REACT_APP_NAME=$REACT_APP_NAME
RUN npm install
RUN npm run build
# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]