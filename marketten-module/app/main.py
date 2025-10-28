from app.config.settings import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import gpt_router

app = FastAPI(
    title = settings.APP_NAME,
    version = "0.1.0",
    description = "마케팅 문구 생성 모듈",
    debug = settings.APP_DEBUG,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.cors_origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(gpt_router.router)

#uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload