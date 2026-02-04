from pydantic import BaseModel, EmailStr
from typing import Optional, List
from .site import SiteRead


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True
