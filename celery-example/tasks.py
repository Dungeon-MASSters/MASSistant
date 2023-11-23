from celery import Celery

app = Celery(
    'tasks',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)


@app.task
def add(x, y):
    return x + y
