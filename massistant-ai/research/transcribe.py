import whisper

class Transcribe():
    def __init__(self) -> None:
        self.model = whisper.load_model("large-v3")

    def __call__(self, audio_file: str) -> dict[str:str, str]:
        text = self.model.transcribe(audio_file, word_timestamps=True)
        return text