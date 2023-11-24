#!/usr/bin/env sh

set -e

bash /wait-for-it.sh db:5432

alembic check

alembic upgrade head

uvicorn app:app --reload --host 0.0.0.0 --port 8080
