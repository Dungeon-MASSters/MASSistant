import ast
import torch
import numpy as np
from sklearn.metrics import f1_score
from sklearn.metrics import precision_recall_fscore_support
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForTokenClassification, Trainer, TrainingArguments, DataCollatorForTokenClassification

torch.manual_seed(0)

MODEL = 'bert-base-multilingual-uncased'
# MODEL = 'xlm-roberta-large'
# MODEL = 'bert-base-multilingual-cased'

DATA = 'bio.csv'
BATCH_SIZE = 6

dataset = load_dataset('csv', data_files=DATA)
label_list = np.unique([item for sublist in dataset['train']['ner_tags'] for item in ast.literal_eval(sublist)])
label_dict = {label_list[0]: 1, label_list[1]: 2, label_list[2]: 0}

tokenizer = AutoTokenizer.from_pretrained(MODEL, add_prefix_space=True)
model = AutoModelForTokenClassification.from_pretrained(MODEL, num_labels=len(label_list)).to('cuda:0')

def tokenize_and_align_labels(examples):
    inputs = [ast.literal_eval(ex) for ex in examples['tokens']]
    tokenized_inputs = tokenizer(inputs, truncation=True, is_split_into_words=True)

    labels = []
    ner = [ast.literal_eval(ex) for ex in examples['ner_tags']]
    for i, label in enumerate(ner):
            word_ids = tokenized_inputs.word_ids(batch_index=i)
            label_ids = []
            for word_idx in word_ids:
                if word_idx is None:
                    label_ids.append(-100)
                else:
                    label_ids.append(label_dict[label[word_idx]])
            labels.append(label_ids)
    tokenized_inputs["labels"] = labels
    return tokenized_inputs

train_val = dataset["train"].train_test_split(
    test_size=0.1, shuffle=False, seed=42
)
train_data = (
    train_val["train"].shuffle().map(tokenize_and_align_labels, batched=True)
)
val_data = (
    train_val["test"].shuffle().map(tokenize_and_align_labels, batched=True)
)
# tokenized_dataset = dataset.map(tokenize_and_align_labels, batched=True)

data_collator = DataCollatorForTokenClassification(tokenizer)

def compute_metrics(p):
    predictions, labels = p
    predictions = np.argmax(predictions, axis=-1)
    
    # Remove ignored index (special tokens) and flatten the output
    true_predictions = [p for prediction, label in zip(predictions, labels) for (p, l) in zip(prediction, label) if l != -100 ]
    true_labels = [l for prediction, label in zip(predictions, labels) for (p, l) in zip(prediction, label) if l != -100]
    precision, recall, f1, _ = precision_recall_fscore_support(y_true=true_labels, y_pred=true_predictions, average=None)
    f1_macro = f1_score(y_true=true_labels, y_pred=true_predictions, average="macro")
    return {
        'precision': list(precision),
        'recall': list(recall),
        'f1': list(f1),
        'f1 macro': f1_macro
    }

args = TrainingArguments(
    f"{MODEL}-finetuned_v2",
    # evaluation_strategy = "epoch",
    logging_strategy = 'epoch',
    save_total_limit=1,
    save_strategy='epoch',
    warmup_steps=250,
    learning_rate=2e-5,
    per_device_train_batch_size=BATCH_SIZE,
    gradient_accumulation_steps=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE,
    num_train_epochs=50,
    lr_scheduler_type='linear',
    metric_for_best_model='f1_m',
    seed=42
)

trainer = Trainer(
    model,
    args,
    train_dataset=train_data,
    eval_dataset=val_data,
    data_collator=data_collator,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics
)

training_output = trainer.train()

# loss = []
# val_loss = []
# for d in trainer.state.log_history:
#     if "loss" in d:
#         loss.append(d["loss"])
#     if "eval_loss" in d:
#         val_loss.append(d["eval_loss"])

# plt.plot(loss)
# plt.plot(val_loss)
# plt.legend(["Training Loss", "Validation Loss"])
# plt.xlabel("Epoch")
# plt.ylabel("Loss")
# plt.show()
# f1_0 = []
# f1_1 = []
# f1_2 = []
# f1_macro = []

# for d in trainer.state.log_history:
#     if "eval_f1" in d:
#         f1_0.append(d["eval_f1"][0])
#         f1_1.append(d["eval_f1"][1])
#         f1_2.append(d["eval_f1"][2])
#         f1_macro.append(d["eval_f1 macro"])

# plt.plot(f1_0)
# plt.plot(f1_1)
# plt.plot(f1_2)
# plt.plot(f1_macro)
# plt.legend(["O", "Keyword Token - B", "Keyword Token - I", "Macro score"])
# plt.xlabel("Epoch")
# plt.ylabel("F1 Score")
# plt.show()