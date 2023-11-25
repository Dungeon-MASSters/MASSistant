import re
import wikipedia
from transformers import pipeline

from syntax_analyzer import SyntaxAnalyzer


class TermExtraction:
    def __init__(self, sa: SyntaxAnalyzer) -> None:
        self.sa = sa
        wikipedia.set_lang('ru')
        self.clf = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            device='cuda:0')
        
    def get_term_meanings(self, text: str, terms: list[str]) -> dict[str, str]:
        terms_to_sentences: dict[str, list[str]] = dict()
        sentences = self.sa.get_sentences(self.sa(text))

        sentences = [sen.lower() for sen in sentences]
        terms = [key.lower() for key in terms]
        terms = [re.sub(r'ыи\b', 'ый', key) for key in terms]

        for sen in sentences:
            for key in terms:
                if re.search(r'#', key):
                    continue
                if re.search(key, sen):
                    if key.lower() in terms_to_sentences.keys():
                        if len(terms_to_sentences[key]) < 4:
                            terms_to_sentences[key].append(sen)
                    else:
                        terms_to_sentences.update({key: [sen]})

        output = []
        output_keys = ('term', 'meaning', 'timestamp')
            
        for term in terms_to_sentences.keys():
            meaning = self.search_wiki_meaning(term, ' '.join(terms_to_sentences[term]))
            if meaning is None:
                continue

            meaning = re.sub(r'\(.*\)\s*|\[.*\]\s*', '', meaning)
            # meaning = re.split(r'—')
            meaning = self.sa.get_sentences(self.sa(meaning))[0]
            if len(meaning) < 35:
                continue

            output.append(dict(zip(
                output_keys, (term, meaning, '')
            )))

        return output
            

    def search_wiki_meaning(self, keyword: str, description: str) -> str:
        search_results = wikipedia.search(keyword, results=5)
        zero_shot_res = self.clf(description, search_results)

        name = zero_shot_res['labels'][0]
        try:
            summary = wikipedia.summary(name)
        except:
            try:
                summary = wikipedia.summary(name + '(Программирование)')
            except:
                try:
                    summary = wikipedia.summary(zero_shot_res['labels'][0])
                except:
                    summary = None
        
        return summary

# a = TermExtraction()
# print(a.get_term_meanings('Во-вторых машинное обучение', terms=['машинное обучение']))

        