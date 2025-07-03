# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Копируем только package.json для кэширования
COPY package.json package-lock.json ./

# 2. Устанавливаем зависимости (включая devDependencies)
RUN npm install --include=dev --force

# 3. Копируем исходный код
COPY . .

# 4. Настраиваем окружение для сборки
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

# 5. Запускаем сборку с дополнительными флагами
RUN npm run build -- --mode production

# Stage 2: Production
FROM nginx:alpine

# 6. Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# 7. Копируем оптимизированный nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 8. Настраиваем права
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80
USER nginx