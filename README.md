# Social Network

## О проекте

Backend для социальной сети. Написан на [NestJS](https://nestjs.com/) с использованием TypeScript.

### Функционал

- Регистрация
- Авторизация по JWT Access / Refresh token
- Посты
  - Текст
  - Фото
  - Комментарии
  - Лайки
- Сообщения
  - Личные сообщения / группы
  - Socket.IO
  - Видеочат
- Пользователи

  - Посты
  - Друзья
  - Фото

- Группы
  - Администрация
  - Посты

### Технологии

- TypeOrm
- Passport
- Redis
- PostgreSQL
- bcrypt
- Multer
- Кастомные декораторы

### Запуск проекта

`yarn start:dev` - локальная разработка

`yarn build` - build

`yarn start:prod` - production build

#### Пример `.env` файла

```
# Application Settings
PORT=4050
NODE_ENV=development

# Database Settings
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# JWT Secret
JWT_SECRET=

```
