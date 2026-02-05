from sqlmodel import select
from sqlalchemy.orm import selectinload
from app.models.group import Group
from app.repositories.base import BaseRepository

class GroupRepository(BaseRepository[Group]):
    def __init__(self, session):
        super().__init__(session, Group)

    async def get_with_sites(self, group_id: int) -> Group | None:
        """Отримати групу і відразу підтягнути список її сайтів"""
        statement = select(Group).where(Group.id == group_id).options(selectinload(Group.sites))
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_multi_by_owner(self, user_id: int) -> list[Group]:
        """Знайти всі групи юзера РАЗОМ із сайтами"""
        statement = (
            select(Group)
            .where(Group.user_id == user_id)
            .options(selectinload(Group.sites))
        )
        result = await self.session.execute(statement)
        return result.scalars().all()