from celery import Celery

celeryApp = Celery(
    'tasks',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)


def send_transcribe_task(id: int, filename: str, mode: str):
    celeryApp.send_task(
        'tasks.do_trans_stuff',
        args=[id, filename, mode],
        kwargs={}
    )


def send_terms_task(id: int, text: str):
    celeryApp.send_task(
        'tasks_terms.do_extract_terms_stuff',
        args=[id, text],
        kwargs={}
    )


def send_summary_task(id: int, text: str):
    celeryApp.send_task(
        'tasks_summary.do_extract_summary_stuff',
        args=[id, text],
        kwargs={}
    )

celeryFeedback = Celery(
    'feedback',
    'rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)

