from sqlmodel import SQLModel, Field
from typing import Optional

# Зв'язок: Група містить багато Сайтів
class GroupSiteLink(SQLModel, table=True):
    group_id: Optional[int] = Field(default=None, foreign_key="group.id", primary_key=True)
    site_id: Optional[int] = Field(default=None, foreign_key="site.id", primary_key=True)

# Зв'язок: Юзер зберіг багато Сайтів (особисті закладки)
class UserSiteLink(SQLModel, table=True):
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", primary_key=True)
    site_id: Optional[int] = Field(default=None, foreign_key="site.id", primary_key=True)