from celery import Celery
import os
import requests
import base64
from multiprocessing import Process, Manager
from summary import GenerateSum
from syntax_analyzer import SyntaxAnalyzer

api_server = os.getenv("API_SERVER")
if api_server is None:
    api_server = "https://demo.dungeon-massters.pro/api"

def send_to_api_server(id: int, extracted_summary: dict) -> int:
    url = api_server + "/konspekt/" + str(id) + "/summary"
    resp = requests.post(url, json={'data': extracted_summary})

    return resp.status_code


app = Celery(
    'tasks_summary',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)

summary = GenerateSum()
analyzer = SyntaxAnalyzer()

@app.task
def do_extract_summary_stuff(id, text: str):

    #data = get_data(filename)  # если что файл кешируется в /tmp с прошлого этапа, но если он почему-то удален, то он скачается заново
    #print(filename, data)

    doc = analyzer(text)

    sentences = analyzer.get_sentences(doc, normalize=False, upos=[])
    
    extracted_summary: dict = summary(sentences)
    print(extracted_summary)

    # print(f'finished job: {filename}')

    send_to_api_server(id, extracted_summary)  # тоже я
