from pydantic import BaseModel


class UploadTranscribedText(BaseModel):
    data: str

class UploadExtractedTerms(BaseModel):
    data: list[dict[str, str]]


class UploadExtractedSummary(BaseModel):
    data: dict[str, str]
