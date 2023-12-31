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


def get_konspekts(db: Session) -> list[KonspektUpload]:
    return db.query(KonspektUpload).order_by(KonspektUpload.created_at).all()


def get_konspekt_by_id(db: Session, id: int) -> Union[KonspektUpload, None]:
    return db.query(KonspektUpload).get(id)

def delete_konspekt_by_id(db: Session, id: int):
    db.query(KonspektUpload).filter_by(id=id).delete()
    db.commit()
