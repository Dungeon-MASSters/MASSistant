import numpy as np
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForMaskedLM, Trainer, TrainingArguments

MODEL = 'bert-base-multilingual-uncased'
MODEL = 'bert-base-multilingual-cased'

DATA = 'chunks.csv'
BATCH_SIZE = 4

tokenizer = AutoTokenizer.from_pretrained(MODEL, add_prefix_space=True)
model = AutoModelForMaskedLM.from_pretrained(MODEL)

dataset = load_dataset('csv', data_files=DATA)
label_list = np.unique([item for sublist in dataset['train']['doc_bio_tags'] for item in sublist])
label_dict = {label_list[0]: 1, label_list[1]: 2, label_list[2]: 0}

args = TrainingArguments(
    f"{MODEL}-finetuned",
    evaluation_strategy = "epoch",
    logging_strategy = 'epoch',
    learning_rate=3e-4,#8e-6,
    per_device_train_batch_size=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE,
    num_train_epochs=10,
    lr_scheduler_type='linear',
    seed=0
)

