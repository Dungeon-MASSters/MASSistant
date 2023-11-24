import ast
import torch
import numpy as np
from sklearn.metrics import f1_score
from sklearn.metrics import precision_recall_fscore_support
from datasets import load_dataset
from tqdm import tqdm
from transformers import AutoTokenizer, AutoModelForTokenClassification, Trainer, TrainingArguments, DataCollatorForTokenClassification

MODEL = 'bert-base-multilingual-cased'

DATA = 'bio.csv'
BATCH_SIZE = 6

dataset = load_dataset('csv', data_files=DATA)
label_list = np.unique([item for sublist in dataset['train']['ner_tags'] for item in ast.literal_eval(sublist)])

tokenizer = AutoTokenizer.from_pretrained('bert-base-multilingual-uncased', add_prefix_space=True)
model = AutoModelForTokenClassification.from_pretrained('/home/prof_evaluation/MASSistant/massistant-ai/research/bert-base-multilingual-uncased-finetuned_v2/checkpoint-600', num_labels=len(label_list)).to('cuda:0')

def extract_keywords_model(data, batch_size):
    keywords = []
    batch_size = 1
    for idx in tqdm(range(0, len(data), batch_size)):
        # print(data[idx: idx+batch_size])
        inputs = tokenizer(data[idx: idx + batch_size], return_tensors='pt', truncation=True).to('cuda')
        outputs = model(**inputs)
        predictions = torch.softmax(outputs.logits, dim=-1).argmax(-1)
        # Decode only sequences that start with 1
        for idx_item in range(predictions.shape[0]): 
            indices_item = []
            indices_single = []
            keywords_item = []
            print(predictions[idx_item])
            for idx, label in enumerate(predictions[idx_item].tolist()):
                if label == 2:
                    indices_single.append(idx)
                elif label == 0 and len(indices_single) > 0:
                    indices_single.append(idx)
                elif label == 1 and len(indices_single) > 0:
                    indices_item.append(indices_single)
                    keywords_item.append(tokenizer.decode(inputs.input_ids[idx_item][indices_single]).strip())
                    print(keywords_item)
                    indices_single = []
            keywords.append(keywords_item)
    return keywords

data = ''
with open('data/text.txt', mode='r', encoding='utf-8') as f:
    data = f.read()

data = [data]
#data = ['Куку']
keywords = extract_keywords_model(data, 1)
print(keywords)