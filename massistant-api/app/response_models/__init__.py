from datetime import datetime
from typing import Union
from pydantic import BaseModel


class DefaultErrorResponse(BaseModel):
    error_msg: str
    error_key: str


class KonspektUploadSuccessResponse(BaseModel):
    msg: str
    key: str
    filename: str


class KonspektsListItem(BaseModel):
    id: int
    created_at: datetime
    original_filename: str
    filename: str
    status: str
    trans_text: Union[str, None]
