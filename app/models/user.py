from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING
from app.models.links import UserSiteLink

if TYPE_CHECKING:
    from app.models.group import Group
    from app.models.site import Site


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, nullable=False)
    email: str = Field(unique=True, nullable=False)
    hashed_password: str = Field(nullable=False)

    # Групи користувача
    groups: List["Group"] = Relationship(back_populates="owner")

    # Окремо збережені сайти ("Вибране")
    saved_sites: List["Site"] = Relationship(back_populates="users_who_saved", link_model=UserSiteLink)