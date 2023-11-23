from typing import Annotated, Union
from fastapi import FastAPI, File, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
import aiofiles
import os
import mimetypes
import uuid

from app.response_models import DefaultErrorResponse, KonspektUploadSuccessResponse

app = FastAPI()

# КОСТЫЛИ ДЛЯ ЛОКАЛЬНОГО ОКРУЖЕНИЯ
origins = [
    "http://massistant.local",
    "https://massistant.local",
    "http://localhost",
    "https://localhost",
    "http://localhost:8080",
    "https://localhost:8080",
    "http://localhost:5173",
    "https://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploads_dir = os.path.abspath("./uploads/")

allowed_mimetypes = [
    "audio/mpeg"
]


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/api/konspekt")
async def upload_konspekt(audio: UploadFile) -> KonspektUploadSuccessResponse | DefaultErrorResponse:
    filename = audio.filename
    og_filename = audio.filename
    mime = audio.content_type

    if mime not in allowed_mimetypes:
        return DefaultErrorResponse(
            error_msg="Тип файла не поддерживается",
            error_key="upload.unsupported_file"
        )

    ext = mimetypes.guess_extension(mime)
    if ext is None:
        return DefaultErrorResponse(
            error_msg="Неизвестный тип файла",
            error_key="upload.unknown_filetype"
        )

    if filename is None:
        filename = str(uuid.uuid4()) + ext

    path_to_save = os.path.join(uploads_dir, filename)
    async with aiofiles.open(path_to_save, 'wb') as out_file:
        while content := await audio.read(1024):  # async read chunk
            await out_file.write(content)  # async write chunk

    return KonspektUploadSuccessResponse(
        msg="Конспетк загружен",
        key="upload.success",
        filename=filename
    )
