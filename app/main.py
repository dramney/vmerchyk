from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from app.core.config import settings
from app.core.db import engine
from app.api.v1 import auth, groups, check

from app.models import User, Group, Site, GroupSiteLink, UserSiteLink

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield

print("📋 TABLES TO CREATE:", SQLModel.metadata.tables.keys())

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # змінити на адресу React-додатка коли створиться
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(groups.router, prefix="/api/v1/groups", tags=["Groups"])
app.include_router(check.router, prefix="/api/v1/check", tags=["Check"])

@app.get("/")
def root():
    return {"message": "Вмерчик API is running! 🧟‍♂️"}