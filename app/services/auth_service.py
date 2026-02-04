from fastapi import HTTPException, status
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserCreate
from app.models.user import User
from app.core.security import hash_password, verify_password


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def register_user(self, user_in: UserCreate) -> User:
        if await self.user_repo.get_by_email(user_in.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Цей email вже зайнятий. Може, ти вже з нами?"
            )

        hashed_pw = hash_password(user_in.password)

        new_user = User(
            username=user_in.username,
            email=user_in.email,
            hashed_password=hashed_pw
        )

        return await self.user_repo.create(new_user)

    async def authenticate_user(self, login: str, password: str) -> User | None:
        """Перевірка логіну та паролю"""
        user = await self.user_repo.get_by_login_identifier(login)

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        return user