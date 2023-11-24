import time
import requests
import pandas as pd
from typing import Union
from config import settings

class GigaChat:
    def __init__(self) -> None:
        self.configure_gigachat()

    def configure_gigachat(self) -> None:
        self.last_time_giga_chat_acsess_token = None
        self.giga_chat_url = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions'
        self.giga_chat_headers = {'Content-Type': 'application/json',
                                  'Authorization':'Bearer '}
        self.giga_chat_data = {
            "model": "GigaChat:latest",
            'messages': [],
            "temperature": 1.0,
            
            "n": 1,
            "repetition_penalty": 1,
            "max_tokens": 100
        }

    def process(self, filename):
        df = pd.read_excel(filename)
        d = dict(zip(df['chunks'].to_list(), df['keywords'].to_list()))

        i = 1
        for key in d.keys():
            print(f'\r{i+1}\{len(d.keys())}', end='')
            i += 1

            keywords = self.giga_chat_generate('Напиши 10 важных слов или терминов из следующего текста: ' + key)
            if keywords is not None:
                d.update({key: keywords})

        df = pd.DataFrame(d.items(), columns=['chunk', 'keywords'])

        return df

    def giga_chat_generate(self, question: str) -> Union[str, None]:
        try:
            messages=[{'role': 'user', 'content': question}]

            self.update_giga_chat_acsses_token()

            data = self.giga_chat_data
            data['messages'] = messages

            try:
                response = requests.post(
                    self.giga_chat_url, 
                    headers=self.giga_chat_headers, 
                    json=data, 
                    verify=False,
                    timeout=20
                )

                answer = response.json()['choices'][0]['message']['content']

                return answer

            except requests.exceptions.Timeout:
                return None
            except Exception as e:
                return None
        except:
            return None 
            
    def update_giga_chat_acsses_token(self):
        need_update = False
        if self.last_time_giga_chat_acsess_token is None:
            need_update = True
        else:
            time_now = time.time()
            elapsed_time = time_now - self.last_time_giga_chat_acsess_token

            if elapsed_time / 60 > 25:
                need_update = True
        
        if need_update:
            self.last_time_giga_chat_acsess_token = time.time()
            token = self.get_giga_chat_acsess_token()
            
            if len(token) == 0:
                return
            
            autorization_token = 'Bearer ' + token
            self.giga_chat_headers['Authorization'] = autorization_token

    def get_giga_chat_acsess_token(self):
        headers = {
            'Authorization': settings.BEARER,
            'RqUID': settings.RQUID,
            'Content-Type': 'application/x-www-form-urlencoded',
        }

        params = {
            'scope': 'GIGACHAT_API_PERS'
        }

        try:
            self.last_time_giga_chat_acsess_token = time.time()
            request = requests.post(
                'https://ngw.devices.sberbank.ru:9443/api/v2/oauth', 
                headers=headers, 
                data=params, 
                verify=False, 
                allow_redirects=True
            )
        
            if request.status_code != 200:
                raise

        except Exception as e:
            return ''
        
        access_token = request.json()['access_token']
        return access_token

# a = GigaChat()
# print(a.giga_chat_generate(
#     'Напиши 5 важных слов или терминов из следующего текста: Привет !'
#     + " Меня зовут Владислав Ефимов , я работаю в команде ВК Рекламы ."
#     + " Прежде чем приступить к изучению языка , я кратко расскажу о преимуществах этого языка программирования , какие задачи можно с помощью него решать и в каких IT - профессиях он используется ."
#     + " Начнем с отличительных преимуществ языка ."
#     + " Во-первых , это простой для понимания использование язык ."
#     + " У языка Python , пожалуй , один из самых простых и понятных синтаксисов относительно других языков ."
#     + " Во-вторых , язык интерпретируемый ."
#     + " Это значит , что вы можете написать код и сразу его запустить , не прибегая к шагу компиляции ."
#     + " Он позволяет исполнять код строка за строкой , что бывает очень удобно и полезно при разработке и исследованиях ."
#     + " В-третьих , это популярный язык , а значит для него существует множество готовых библиотек , которые решают реальные задачи , а не придется придумывать и писать какие-то вещи с нуля ."
#     + " В-четвертых , популярность языка также означает большое сообщество разработчиков и энтузиастов ."
#     + " Из-за этого в сети можно найти много гайдов , обсуждений , обучающих материалов и многого другого ."
#     + " И в-пятых , портативность ."
#     + " Код на Python , написанный на одной платформе , например , на Mac , спокойно запустится на другой , например , на Windows ."
#     + " Если говорить об областях применения , то язык Python применяется во многих , например , в областях , например , во-первых , это веб-разработка ."
#     + ' Можно строить бэкэнд - веб-приложения в качестве веб-разработчика .'
#     + " Большой набор библиотек и встроенных инструментов позволяет построить как небольшое приложение , так и большой сложный сервис с базами данных и микросервисами ."
#     + " Во-вторых , машинное обучение и искусственный интеллект ."
#     + ' В качестве ML-специалиста можно разрабатывать различные решения на этом языке .'
#     + ' От простых статистических моделей до сложных нейронных сетей .'
#     + " А скомбинировав это с разработкой веб-приложения , можно создать свой неповторимый онлайн - сервис ."
#     + " В-третьих , анализ данных ."
#     + " Аналитикам данных Python помогает проверки гипотез , визуализации и обработки данных ."
#     + " Что немаловажно , все это получается делать быстро и удобно с понятным и несложным синтаксисом Python ."
#     + " В-четвертых , автоматизация тестирования ."
#     + " И , конечно , как и любой код , код на Python , особенно если это уже не маленький проект , нуждается в тестировании ."
#     + ' Поэтому профессия тестировщика Python тоже очень актуальна .'
#     + " И , как и во всех предыдущих предыдущих , для тестирования существует множество готовых библиотек ."
#     + ' Теперь перейдем к изучению языка .'))