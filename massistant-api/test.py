from celery import Celery

app = Celery(
    'tasks',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)

app.send_task(
    'tasks.do_trans_stuff',
    args=[
        42,
        "hello-world-fake-file.txt"
    ],
    kwargs={})
