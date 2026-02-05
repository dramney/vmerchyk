from fastapi import APIRouter, Depends
from typing import List
from app.schemas.check import SiteStatus
from app.services.checker_service import CheckerService
from app.api.deps import get_checker_service
import httpx

router = APIRouter()

@router.get("/groups/{group_id}", response_model=List[SiteStatus])
async def check_group_status(
    group_id: int,
    service: CheckerService = Depends(get_checker_service)
):
    return await service.check_group(group_id)

@router.get("/check", response_model=SiteStatus)
async def check_site(
    url: str,
    service: CheckerService = Depends(get_checker_service)
):
    async with httpx.AsyncClient() as client:
        return await service.check_single_url(client, url)

