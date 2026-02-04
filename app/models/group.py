from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING
from app.models.links import GroupSiteLink

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.site import Site


class Group(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    user_id: int = Field(foreign_key="user.id")

    owner: "User" = Relationship(back_populates="groups")
    sites: List["Site"] = Relationship(back_populates="groups", link_model=GroupSiteLink)