from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.models.user import User

# Імпорт Репозиторіїв
from app.repositories.user_repo import UserRepository
from app.repositories.group_repo import GroupRepository
from app.repositories.site_repo import SiteRepository

# Імпорт Сервісів
from app.services.auth_service import AuthService
from app.services.group_service import GroupService
from app.services.checker_service import CheckerService

# 1. Отримуємо Репозиторії
def get_user_repo(session: AsyncSession = Depends(get_session)) -> UserRepository:
    return UserRepository(session)

def get_group_repo(session: AsyncSession = Depends(get_session)) -> GroupRepository:
    return GroupRepository(session)

def get_site_repo(session: AsyncSession = Depends(get_session)) -> SiteRepository:
    return SiteRepository(session)

# 2. Отримуємо Сервіси
def get_auth_service(user_repo: UserRepository = Depends(get_user_repo)) -> AuthService:
    return AuthService(user_repo)

def get_group_service(
    group_repo: GroupRepository = Depends(get_group_repo),
    site_repo: SiteRepository = Depends(get_site_repo)
) -> GroupService:
    return GroupService(group_repo, site_repo)

def get_checker_service(group_repo: GroupRepository = Depends(get_group_repo)) -> CheckerService:
    return CheckerService(group_repo)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
        token: str = Depends(oauth2_scheme),
        user_repo: UserRepository = Depends(get_user_repo)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не можу розпізнати цей токен",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await user_repo.get_by_email(email)
    if user is None:
        raise credentials_exception
    return user