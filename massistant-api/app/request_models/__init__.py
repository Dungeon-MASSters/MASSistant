from pydantic import BaseModel


class UploadTranscribedText(BaseModel):
    data: str
