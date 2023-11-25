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
