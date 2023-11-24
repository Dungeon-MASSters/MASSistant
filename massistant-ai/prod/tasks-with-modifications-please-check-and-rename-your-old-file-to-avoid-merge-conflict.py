from celery import Celery
from transcribe import Transcribe
import os
import requests
import base64

api_server = os.getenv("API_SERVER")
if api_server is None:
    api_server = "https://demo.dungeon-massters.pro/api"

files_dir = "/tmp/massistant_uploads/"

if not os.path.exists(files_dir):
    os.mkdir(files_dir)


def get_file_from_server(filename: str) -> str:
    path_to_file = os.path.join(files_dir, filename)
    if os.path.exists(path_to_file):
        return path_to_file

    url = api_server + "/konspekt/audio/" + filename
    resp = requests.get(url, allow_redirects=True)
    open(path_to_file, "wb").write(resp.content)

    return path_to_file


def send_to_api_server(id: int, text: str) -> int:
    data = base64.b64encode(text.encode("utf8"))

    url = api_server + "/konspekt/" + str(id) + "/transcribed"
    resp = requests.post(url, json={'data': data})

    return resp.status_code


app = Celery(
    'tasks',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)

transcribe = Transcribe()


@app.task
def do_trans_stuff(id, filename):

    data = get_file_from_server(filename)  # - это напишу я

    transcribed_text = transcribe(data)  # модель транскрибации
    text = transcribed_text['text']

    send_to_api_server(id, text)  # тоже я
