"""add trans text

Revision ID: 0ce354459152
Revises: a35ecaffa8d6
Create Date: 2023-11-24 12:03:34.929132

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0ce354459152'
down_revision: Union[str, None] = 'a35ecaffa8d6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('konspekt_uploads', sa.Column('transcribe', sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('konspekt_uploads', 'transcribe')
    # ### end Alembic commands ###
