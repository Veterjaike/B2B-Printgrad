# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Копируем только package.json для кэширования
COPY package.json package-lock.json ./

# 2. Устанавливаем зависимости (включая devDependencies для сборки)
RUN npm install --include=dev

# 3. Копируем исходный код
COPY . .

# 4. Запускаем сборку с явным указанием окружения
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# 5. Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# 6. Оптимальный nginx.conf для Vite
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 7. Права доступа
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
USER nginx