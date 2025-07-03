# Stage 1: Build (Builder)
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Копируем только lock-файлы для кэширования
COPY package.json package-lock.json ./

# 2. Чистая установка зависимостей (без devDependencies)
RUN npm ci --omit=dev

# 3. Копируем остальные файлы
COPY . .

# 4. Сборка с production-флагом
RUN npm run build

# Stage 2: Production (NGINX)
FROM nginx:stable-alpine

# 5. Копируем только необходимые файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# 6. Оптимизированная конфигурация nginx для SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 7. Безопасность: запуск от непривилегированного пользователя
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

USER nginx

CMD ["nginx", "-g", "daemon off;"]