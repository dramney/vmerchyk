from pydantic import BaseModel, HttpUrl, Field
from typing import Optional

class SiteBase(BaseModel):
    url: HttpUrl
    title: Optional[str] = None

class SiteCreate(SiteBase):
    pass

class SiteRead(BaseModel):
    id: int
    url: HttpUrl
    title: Optional[str] = None

    class Config:
        from_attributes = True