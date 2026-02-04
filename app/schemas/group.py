from pydantic import BaseModel
from typing import List, Optional
from app.schemas.site import SiteRead

class GroupBase(BaseModel):
    name: str

class GroupCreate(GroupBase):
    pass

class GroupRead(GroupBase):
    id: int
    sites: List[SiteRead] = []

    class Config:
        from_attributes = True