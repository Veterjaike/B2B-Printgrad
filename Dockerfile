# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Копируем только package.json для кэширования
COPY package.json package-lock.json ./

# 2. Устанавливаем зависимости
RUN npm install --production

# 3. Копируем остальные файлы
COPY . .

# 4. Запускаем сборку
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# 5. Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# 6. Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80