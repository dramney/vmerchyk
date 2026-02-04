from fastapi import HTTPException
from app.models.group import Group
from app.models.site import Site
from app.repositories.group_repo import GroupRepository
from app.repositories.site_repo import SiteRepository
from app.schemas.group import GroupCreate


class GroupService:
    def __init__(self, group_repo: GroupRepository, site_repo: SiteRepository):
        self.group_repo = group_repo
        self.site_repo = site_repo

    async def create_group(self, group_in: GroupCreate, user_id: int) -> Group:
        group = Group(name=group_in.name, user_id=user_id)
        new_group = await self.group_repo.create(group)
        new_group.sites = []

        return new_group

    async def add_site_to_group(self, group_id: int, url: str) -> Group:
        group = await self.group_repo.get_with_sites(group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Група зникла в небуття")

        url_str = str(url)
        site = await self.site_repo.get_by_url(url_str)

        if not site:
            site = Site(url=url_str)
            site = await self.site_repo.create(site)

        if site in group.sites:
            raise HTTPException(status_code=400, detail="Цей пацієнт вже в палаті")

        group.sites.append(site)

        await self.group_repo.session.commit()
        await self.group_repo.session.refresh(group)

        return group