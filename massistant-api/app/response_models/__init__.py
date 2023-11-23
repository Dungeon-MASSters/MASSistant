from pydantic import BaseModel


class DefaultErrorResponse(BaseModel):
    error_msg: str
    error_key: str


class KonspektUploadSuccessResponse(BaseModel):
    msg: str
    key: str
    filename: str
