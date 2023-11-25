from celery import Celery
import os
import requests
import base64
from multiprocessing import Process, Manager
from keywords import Keywords
from term_extraction import TermExtraction
from syntax_analyzer import SyntaxAnalyzer

api_server = os.getenv("API_SERVER")
if api_server is None:
    api_server = "https://demo.dungeon-massters.pro/api"

def send_to_api_server(id: int, extracted_terms: list[dict[str, str]]) -> int:
    url = api_server + "/konspekt/" + str(id) + "/terms"
    resp = requests.post(url, json={'data': extracted_terms})

    return resp.status_code


app = Celery(
    'tasks_terms',
    backend='rpc://',
    broker='pyamqp://app:dungeon@rabbit.dungeon-massters.pro:5672/'
)

sa = SyntaxAnalyzer()
kw = Keywords(sa)
te = TermExtraction(sa)

@app.task
def do_extract_terms_stuff(id, text: str):

    keys = kw.get_keywords(text, 1)
    extracted_terms = te.get_term_meanings(text, keys)
    # extracted_terms: list[dict[str, str]] = extract_terms_func_or_smth(data)
    print(extracted_terms)

    print(f'finished job - term extraction')

    send_to_api_server(id, extracted_terms)  # тоже я
