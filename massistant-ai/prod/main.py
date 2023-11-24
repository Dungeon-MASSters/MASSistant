from celery import Celery
from transcribe import Transcribe

app = Celery(
    'tasks',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)

transcribe = Transcribe()

@app.task
def do_trans_stuff(id, filename):
    data = get_file_from_server() # - это напишу я

    transcribed_text = transcribe(data) # модель транскрибации
    text = transcribed_text['text']

    send_to_api_server(id, text) # тоже я
