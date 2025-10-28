from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    #앱 환경 설정
    APP_NAME: str
    APP_ENV: str
    APP_DEBUG: bool
    APP_HOST: str
    APP_PORT: int

    #CORS
    CORS_ORIGINS: str

    #네이버 데이터랩 통합검색 API 호출 시 필요 정보
    CLIENT_ID: str
    CLIENT_SECRET: str

    #할당할 값 불러오기
    model_config = SettingsConfigDict(
        env_file = ".env.local",
        env_file_encoding="utf-8"
    )

    #cors 할당값 분할
    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]
    
settings = Settings()