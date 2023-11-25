# MASSistant

[![Deploy](https://github.com/Dungeon-MASSters/MASSistant/actions/workflows/deploy.yml/badge.svg)](https://github.com/Dungeon-MASSters/MASSistant/actions/workflows/deploy.yml)

[Демо](https://demo.dungeon-massters.pro)\
[Начальный прототип UI](https://www.figma.com/file/yKx3HPXASu692FvO7Bkio2/MASSistant?type=design&node-id=106%3A52&mode=design&t=3QVcwK66235eO7aL-1)
[Руководство пользователя](https://github.com/Dungeon-MASSters/MASSistant/blob/main/massistant-web-app/README.md)
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

