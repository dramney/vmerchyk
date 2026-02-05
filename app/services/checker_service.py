import httpx
import asyncio
import time
import random
from app.schemas.check import SiteStatus
from app.repositories.group_repo import GroupRepository

ALIVE_LABELS = ["Живчик", "Дихає", "Ще побігає", "В нормі"]
DEAD_LABELS = ["Вмер", "Відійшов у вічність", "Пішов за кораблем", "R.I.P."]


class CheckerService:
    def __init__(self, group_repo: GroupRepository):
        self.group_repo = group_repo

    async def check_single_url(self, client: httpx.AsyncClient, url: str) -> SiteStatus:
        start_time = time.perf_counter()
        try:
            response = await client.get(url, timeout=10.0, follow_redirects=True)
            duration = time.perf_counter() - start_time

            is_alive = response.status_code < 400
            label = random.choice(ALIVE_LABELS) if is_alive else random.choice(DEAD_LABELS)

            return SiteStatus(
                url=url,
                status_code=response.status_code,
                is_alive=is_alive,
                response_time=round(duration, 3),
                label=label
            )
        except Exception as e:
            label = random.choice(DEAD_LABELS)
            return SiteStatus(
                url=url,
                status_code=0,
                is_alive=False,
                response_time=0.0,
                label=label,
                error=str(e)
            )

    async def check_group(self, group_id: int):
        group = await self.group_repo.get_with_sites(group_id)
        if not group or not group.sites:
            return []

        async with httpx.AsyncClient() as client:
            tasks = [self.check_single_url(client, site.url) for site in group.sites]

            results = await asyncio.gather(*tasks)
            return results