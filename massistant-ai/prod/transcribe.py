import whisper

class Transcribe():
    def __init__(self) -> None:
        # self.model = whisper.load_model("large-v3", device='cuda:0')
        self.model = whisper.load_model("medium", device='cuda:0')

    def __call__(self, audio_file: str):
        text = self.model.transcribe(audio_file, word_timestamps=True, language='ru')
        return text
