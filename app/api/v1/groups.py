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

@router.get("/", response_model=list[GroupRead])
async def read_groups(
    service: GroupService = Depends(get_group_service),
    current_user: User = Depends(get_current_user),
):
    """Отримати список груп поточного користувача"""
    return await service.get_user_groups(current_user.id)

@router.delete("/{group_id}", status_code=204)
async def delete_group(
    group_id: int,
    service: GroupService = Depends(get_group_service),
    current_user: User = Depends(get_current_user),
):
    await service.delete_group(group_id, current_user.id)
    return None

@router.delete("/{group_id}/sites/{site_id}", response_model=GroupRead)
async def remove_site(
    group_id: int,
    site_id: int,
    service: GroupService = Depends(get_group_service),
    current_user: User = Depends(get_current_user),
):
    return await service.remove_site_from_group(group_id, site_id, current_user.id)