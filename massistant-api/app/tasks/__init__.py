from celery import Celery

celeryApp = Celery(
    'tasks',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)


celeryAppTerms = Celery(
    'tasks_terms',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)


celeryAppSummary = Celery(
    'tasks_summary',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)


def send_transcribe_task(id: int, filename: str, mode: str):
    celeryApp.send_task(
        'tasks.do_trans_stuff',
        args=[id, filename, mode],
        kwargs={},
        queue="queue_trans",
        exchange="queue_trans"
    )


def send_terms_task(id: int, text: str):
    celeryAppTerms.send_task(
        'tasks_terms.do_extract_terms_stuff',
        args=[id, text],
        kwargs={},
        queue="queue_terms",
        exchange="queue_terms"
    )


def send_summary_task(id: int, text: str):
    celeryAppSummary.send_task(
        'tasks_summary.do_extract_summary_stuff',
        args=[id, text],
        kwargs={},
        queue="queue_summary",
        exchange="queue_summary"
    )


celeryFeedback = Celery(
    'feedback',
    'rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)
