from celery import Celery

celeryApp = Celery(
    'tasks',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)


def send_transcribe_task(id: int, filename: str):
    celeryApp.send_task(
        'tasks.do_trans_stuff',
        args=[id, filename],
        kwargs={}
    )


celeryFeedback = Celery(
    'feedback',
    'rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)

