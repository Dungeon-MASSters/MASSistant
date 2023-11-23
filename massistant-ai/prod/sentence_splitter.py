import stanza
from decorators import free_cache

class SyntaxAnalyzer:
    @free_cache
    def __init__(self) -> None:
        self.pipeline = stanza.Pipeline(
            lang='ru', 
            use_gpu=True, 
            package='syntagrus'
        ) 

    def __call__(self, text: str) -> stanza.Document:
        """Сегментация и синтаксический анализ текста

        Args:
            text (str): Входной текст

        Raises:
            AssertionError: при некорректных входных данных
            ValueError: при ошибке обработки текста

        Returns:
            stanza.Document: Список предложений с метками
        """
        assert type(text) is str
        assert len(text) != 0

        doc = self.pipeline(text)
        if doc is None:
            raise ValueError
        
        return doc

    @staticmethod
    def concat_sentences(doc: stanza.Document) -> str:
        return ' '.join([token.text for sentence in doc.sentences for token in sentence.tokens])
    
cl = SyntaxAnalyzer()
doc = cl('Привет. Как дела?')
print(cl.concat_sentences(doc))