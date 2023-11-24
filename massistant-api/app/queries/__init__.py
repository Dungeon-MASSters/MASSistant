from typing import Union

from sqlalchemy.orm import Session

from app.models import KonspektUpload


def create_konspekt_upload(db: Session, orignal_filename: Union[str, None], filename: str) -> KonspektUpload:
    new_upload = KonspektUpload(
        original_filename=orignal_filename,
        filename=filename
    )
    db.add(new_upload)
    db.commit()
    db.refresh(new_upload)
    return new_upload

