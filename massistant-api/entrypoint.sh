#!/usr/bin/env sh

set -e

alembic check

alembic upgrade head

uvicorn app:app --reload --host 0.0.0.0 --port 8080
