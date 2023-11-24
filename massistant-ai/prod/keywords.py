import torch
from tqdm import tqdm
from transformers import AutoTokenizer, AutoModelForTokenClassification
from pathlib import Path
from decorators import free_cache

class Keywords:
    def __init__(self) -> None:
        self.load_model()

    @free_cache
    def load_model(self) -> None:
        self.bert_dir = Path(__file__).resolve().parent.joinpath('bert-base-v2')

        self.tokenizer = AutoTokenizer.from_pretrained(self.bert_dir, add_prefix_space=True)
        self.model = AutoModelForTokenClassification.from_pretrained(self.bert_dir, num_labels=3).to('cuda:0')

    def get_keywords(self, data, batch_size) -> list[str]:
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
        return keywords
    
# a = Keywords()

# data = ''
# with open('text.txt', mode='r', encoding='utf-8') as f:
#     data = f.read()

# data = [data]
# keywords = a.get_keywords(data, 1)
# print(keywords)