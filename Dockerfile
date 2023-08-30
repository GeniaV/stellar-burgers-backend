FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build \
    && rm -rf ./src \
    && rm -rf ./node_modules \
    && rm -rf ./docs \
    && rm -rf ./.dockerignore \
    && rm -rf ./.editorconfig \
    && rm -rf ./.env.example \
    && rm -rf ./.eslintrc \
    && rm -rf ./.gitignore \
    && rm -rf ./Dockerfile \
    && rm -rf ./error.log \
    && rm -rf ./request.log \
    && rm -rf ./README.md

FROM node:16-alpine AS backend
WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm install pm2 -g
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js .
EXPOSE 4000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]