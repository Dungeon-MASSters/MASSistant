from transformers import AutoTokenizer, T5ForConditionalGeneration
import torch

START = 0.15
MED = 0.7
END = 0.15

STEP = 0.1
NUM_SYMB = 600

class GenerateSum:
    def __init__(self) -> None:
        self.DEVICE = torch.device('cuda:0')
        model_name = "IlyaGusev/rut5_base_sum_gazeta"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = T5ForConditionalGeneration.from_pretrained(model_name).to(self.DEVICE)

    def __call__(self, text: list) -> dict[str: list]:

        if len(text) == 0:
            return ''

        result = {'introduction': [],
                  'main_part': [],
                  'conclusion': []}

        prompt = ''

        intro = int(len(text) * START)
        med = int(len(text) * (START + MED))

        for i in range(len(text)):
            prompt += ' ' + text[i]

            if len(prompt) < NUM_SYMB and i != len(text) - 1:
                continue

            input_ids = self.tokenizer(
                [prompt],
                max_length=1000,
                add_special_tokens=True,
                padding="max_length",
                truncation=True,
                return_tensors="pt"
            )["input_ids"]

            output_ids = self.model.generate(
                input_ids=input_ids,
                no_repeat_ngram_size=4,
                min_length=30
            )[0]

            summary = self.tokenizer.decode(output_ids, skip_special_tokens=True)

            if i <= intro:
                result['introduction'].append(summary)
            elif i <= med:
                result['main_part'].append(summary)
            else:
                result['conclusion'].append(summary)

            prompt = ''
        return result

        #return self.generate_big_sum(text)
