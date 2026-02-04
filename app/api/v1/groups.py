from fastapi import APIRouter, Depends
from typing import List
from app.schemas.group import GroupCreate, GroupRead
from app.models.user import User
from app.services.group_service import GroupService
from app.api.deps import get_group_service, get_current_user

router = APIRouter()

@router.post("/", response_model=GroupRead)
async def create_group(
    group_in: GroupCreate,
    current_user: User = Depends(get_current_user),
    service: GroupService = Depends(get_group_service)
):
    return await service.create_group(group_in, current_user.id)

@router.post("/{group_id}/sites", response_model=GroupRead)
async def add_site_to_group(
    group_id: int,
    url: str,
    current_user: User = Depends(get_current_user),
    service: GroupService = Depends(get_group_service)
):
    return await service.add_site_to_group(group_id, url)