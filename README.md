# MASSistant

[![Deploy](https://github.com/Dungeon-MASSters/MASSistant/actions/workflows/deploy.yml/badge.svg)](https://github.com/Dungeon-MASSters/MASSistant/actions/workflows/deploy.yml)

## Локальное докер окружение

```bash
docker-compose up

# или для последних версий докера
docker compose up
```

После запуска окружения нам доступны:

- http://127.0.0.1:8000/ - веб-приложения
- http://127.0.0.1:8080/docs - документация API
- http://127.0.0.1:8888 - админка бд
  - креды: `postgres:postgres`
- http://127.0.0.1:15762 - админка RabbitMQ
  - креды: `rabbit:rabbit`

