from sqlmodel import select
from sqlalchemy.orm import selectinload
from app.models.user import User
from app.repositories.base import BaseRepository

class UserRepository(BaseRepository[User]):
    def __init__(self, session):
        super().__init__(session, User)

    async def get_by_username(self, username: str) -> User | None:
        """Пошук юзера для авторизації"""
        statement = select(User).where(User.username == username)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        """Пошук юзера суто по email (для перевірки реєстрації)"""
        statement = select(User).where(User.email == email)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_with_saved_sites(self, user_id: int) -> User | None:
        """Завантажити юзера РАЗОМ із його збереженими сайтами"""
        statement = select(User).where(User.id == user_id).options(selectinload(User.saved_sites))
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_login_identifier(self, identifier: str) -> User | None:
        """Шукає юзера по email АБО по username"""
        statement = select(User).where(
            (User.email == identifier) | (User.username == identifier)
        )
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()