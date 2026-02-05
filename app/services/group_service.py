from enum import verify

from fastapi import HTTPException
from bs4 import BeautifulSoup
import httpx
from app.models.group import Group
from app.models.site import Site
from app.repositories.group_repo import GroupRepository
from app.repositories.site_repo import SiteRepository
from app.schemas.group import GroupCreate


class GroupService:
    def __init__(self, group_repo: GroupRepository, site_repo: SiteRepository):
        self.group_repo = group_repo
        self.site_repo = site_repo

    async def _fetch_site_title(self, url: str) -> str | None:
        """
        Приватний метод: стукає на сайт і намагається вкрасти його <title>
        """
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }

            async with httpx.AsyncClient(follow_redirects=True, timeout=10.0, verify=False) as client:
                response = await client.get(str(url), headers=headers)

                if response.status_code < 400:
                    soup = BeautifulSoup(response.content, "html.parser")
                    if soup.title and soup.title.string:
                        title = soup.title.string.strip()
                        print(f"Знайдено заголовок: {title}")
                        return title

            return None
        except Exception as e:
            print(f"Не вдалося отримати заголовок для {url}: {e}")
            return None

    async def create_group(self, group_in: GroupCreate, user_id: int) -> Group:
        group = Group(name=group_in.name, user_id=user_id)
        created_group = await self.group_repo.create(group)

        return await self.group_repo.get_with_sites(created_group.id)

    async def add_site_to_group(self, group_id: int, url: str) -> Group:
        group = await self.group_repo.get_with_sites(group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Група зникла в небуття")

        url_str = str(url)
        site = await self.site_repo.get_by_url(url_str)

        if not site:
            fetched_title = await self._fetch_site_title(url_str)
            site = Site(url=url_str, title=fetched_title)
            site = await self.site_repo.create(site)

        if site in group.sites:
            raise HTTPException(status_code=400, detail="Цей пацієнт вже в палаті")

        group.sites.append(site)

        await self.group_repo.session.commit()
        await self.group_repo.session.refresh(group)

        return group