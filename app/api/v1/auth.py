from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import UserCreate, UserRead
from app.schemas.auth import Token
from app.services.auth_service import AuthService
from app.api.deps import get_auth_service
from app.core.security import create_access_token

router = APIRouter()


@router.post("/register", response_model=UserRead)
async def register(
        user_in: UserCreate,
        service: AuthService = Depends(get_auth_service)
):
    return await service.register_user(user_in)


@router.post("/login", response_model=Token)
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        service: AuthService = Depends(get_auth_service)
):
    user = await service.authenticate_user(login=form_data.username, password=form_data.password)

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Неправильний логін (username/email) або пароль"
        )

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}