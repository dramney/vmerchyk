from fastapi import APIRouter, Depends
from typing import List
from app.schemas.check import SiteStatus
from app.services.checker_service import CheckerService
from app.api.deps import get_checker_service

router = APIRouter()

@router.get("/groups/{group_id}", response_model=List[SiteStatus])
async def check_group_status(
    group_id: int,
    service: CheckerService = Depends(get_checker_service)
):
    return await service.check_group(group_id)