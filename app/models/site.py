from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING
from app.models.links import GroupSiteLink, UserSiteLink

if TYPE_CHECKING:
    from app.models.group import Group
    from app.models.user import User


class Site(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str = Field(unique=True, index=True, nullable=False)
    title: Optional[str] = Field(default=None)

    # Сайти в групах
    groups: List["Group"] = Relationship(back_populates="sites", link_model=GroupSiteLink)

    # Сайти в закладках юзерів
    users_who_saved: List["User"] = Relationship(back_populates="saved_sites", link_model=UserSiteLink)