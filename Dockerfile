# Этап сборки
FROM node:18 AS builder

WORKDIR /app

# Сначала копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь остальной исходный код
COPY . .

# Собираем проект
RUN npm run build

# Этап продакшн
FROM nginx:stable-alpine

# Копируем готовую сборку из предыдущего этапа
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфиг nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
