FROM python:3.11-bookworm

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN chmod +x ./wait-for-it.sh

RUN mkdir -p /app/uploads
