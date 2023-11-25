from celery import Celery
import os
import requests
import base64
from multiprocessing import Process, Manager

api_server = os.getenv("API_SERVER")
if api_server is None:
    api_server = "https://demo.dungeon-massters.pro/api"

files_dir = "/home/prof_evaluation/tmp/MASSistant/massistant-ai/prod/tmp/"

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


def send_to_api_server(id: int, extracted_summary: dict) -> int:
    url = api_server + "/konspekt/" + str(id) + "/summary"
    resp = requests.post(url, json={'data': extracted_summary})

    return resp.status_code


app = Celery(
    'tasks_summary',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)

@app.task
def do_extract_summary_stuff(id, filename, mode: str):

    data = get_file_from_server(filename)  # если что файл кешируется в /tmp с прошлого этапа, но если он почему-то удален, то он скачается заново
    print(filename, data)
    
    extracted_summary: dict = extract_summary_func_or_smth(data)
    print(extracted_summary)

    print(f'finished job: {filename}')

    send_to_api_server(id, extracted_summary)  # тоже я
