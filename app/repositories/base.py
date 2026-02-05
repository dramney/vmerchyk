from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlmodel import SQLModel

T = TypeVar("T", bound=SQLModel)


class BaseRepository(Generic[T]):
    def __init__(self, session: AsyncSession, model: Type[T]):
        self.session = session
        self.model = model

    async def create(self, obj: T) -> T:
        """Створити запис у БД"""
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_by_id(self, id: int) -> Optional[T]:
        """Отримати один запис по ID"""
        return await self.session.get(self.model, id)

    async def get_all(self) -> List[T]:
        """Отримати всі записи таблиці"""
        statement = select(self.model)
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def delete(self, obj: T) -> None:
        """Видалити запис"""
        await self.session.delete(obj)
        await self.session.commit()

    async def get(self, id: int) -> Optional[T]:
        return await self.session.get(self.model, id)