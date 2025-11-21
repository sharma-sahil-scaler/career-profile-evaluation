FROM node:24-alpine AS build
WORKDIR /app

ARG NPM_TOKEN
COPY package.json package-lock.json ./

RUN if [ -n "$NPM_TOKEN" ]; then \
      echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc; \
      echo "@interviewbit:registry=https://registry.npmjs.org/" >> .npmrc; \
    fi

RUN npm install
COPY . .
ARG REACT_APP_API_BASE_URL=http://localhost:8000
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
