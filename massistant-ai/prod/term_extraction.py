import re
import wikipedia
from transformers import pipeline

from syntax_analyzer import SyntaxAnalyzer


class TermExtraction:
    def __init__(self) -> None:
        self.sa = SyntaxAnalyzer()
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

        for sen in sentences:
            for key in terms:
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
            meaning = re.sub(r'\(.*\)\s*', '', meaning)
            meaning = self.sa.get_sentences(self.sa(meaning))[0]
            output.append(dict(zip(
                output_keys, (term, meaning, '')
            )))

        return output
            

    def search_wiki_meaning(self, keyword: str, description: str) -> str:
        search_results = wikipedia.search(keyword, results=5)
        zero_shot_res = self.clf(description, search_results)

        name = zero_shot_res['labels'][0]
        summary = wikipedia.summary(name)
        
        return summary

a = TermExtraction()
print(a.get_term_meanings('Во-вторых машинное обучение', terms=['машинное обучение']))

        