import torch
from tqdm import tqdm
from transformers import AutoTokenizer, AutoModelForTokenClassification
from pathlib import Path
from decorators import free_cache
from syntax_analyzer import SyntaxAnalyzer
import itertools

def split_arr(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

class Keywords:
    def __init__(self, sa: SyntaxAnalyzer) -> None:
        self.sa = sa
        self.load_model()

    @free_cache
    def load_model(self) -> None:
        self.bert_dir = Path(__file__).resolve().parent.joinpath('bert-base-v3')

        self.tokenizer = AutoTokenizer.from_pretrained(self.bert_dir, add_prefix_space=True)
        self.model = AutoModelForTokenClassification.from_pretrained(self.bert_dir, num_labels=3).to('cuda:0')

    def preprocess_data(self, data: str) -> list[str]:
        sentences = self.sa.get_sentences(self.sa(data))
        chunks = split_arr(sentences, 40)
        chunks = [' '.join(chunk) for chunk in chunks]

        return chunks
    
    def postprocess(self, keywords: list[list[str]]) -> list[str]:
        chain = set(itertools.chain.from_iterable(keywords))

        return list(chain)

    def get_keywords(self, data: str, batch_size: int) -> list[str]:
        data: list[str] = self.preprocess_data(data)
        keywords = []
        batch_size = 1
        for idx in tqdm(range(0, len(data), batch_size)):
            inputs = self.tokenizer(data[idx: idx + batch_size], return_tensors='pt', truncation=True).to('cuda:0')
            outputs = self.model(**inputs)
            predictions = torch.softmax(outputs.logits, dim=-1).argmax(-1)
            for idx_item in range(predictions.shape[0]): 
                indices_item = []
                indices_single = []
                keywords_item = []
                for idx, label in enumerate(predictions[idx_item].tolist()):
                    if label == 2:
                        indices_single.append(idx)
                    elif label == 0 and len(indices_single) > 0:
                        indices_single.append(idx)
                    elif label == 1 and len(indices_single) > 0:
                        indices_item.append(indices_single)
                        keywords_item.append(self.tokenizer.decode(inputs.input_ids[idx_item][indices_single]).strip())
                        indices_single = []
                keywords.append(keywords_item)

        return self.postprocess(keywords)
    
# a = Keywords(SyntaxAnalyzer())

# data = ''
# with open('data/text.txt', mode='r', encoding='utf-8') as f:
#     data = f.read()

# keywords = a.get_keywords(data, 1)
# print(keywords)