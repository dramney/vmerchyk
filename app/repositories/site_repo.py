from sqlmodel import select
from app.models.site import Site
from app.repositories.base import BaseRepository

class SiteRepository(BaseRepository[Site]):
    def __init__(self, session):
        super().__init__(session, Site)

    async def get_by_url(self, url: str) -> Site | None:
        """Перевірити, чи такий сайт вже є в базі"""
        statement = select(Site).where(Site.url == url)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()