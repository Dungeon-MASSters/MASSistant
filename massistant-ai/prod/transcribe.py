import whisper

class Transcribe():
    def __init__(self) -> None:
        # self.model = whisper.load_model("large-v3", device='cuda:0')
        self.model = whisper.load_model("medium", device='cuda:0')
        self.tiny_model = whisper.load_model("tiny", device='cuda:0')

    def __call__(self, audio_file: str, mode: str):
        if mode not in ('medium', 'tiny'):
            print(f'Некорректный режим транскрибации: {mode}')
            mode = 'medium'

        if mode == 'medium':
            text = self.model.transcribe(audio_file, word_timestamps=True, language='ru')
        else:
            text = self.tiny_model.transcribe(audio_file, word_timestamps=True, language='ru')

        return text
