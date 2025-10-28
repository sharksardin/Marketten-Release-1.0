from pydantic import BaseModel
from typing import TypeVar, Generic, Optional

T = TypeVar("T")

#응답 형태
class ModuleResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[dict] = None

#마케팅 문구 생성 성공 시 응답
def succeed(data) -> ModuleResponse:
    return ModuleResponse(success=True, data=data, error=None)

#마케팅 문구 생성 실패 시 응답
def fail(code: str, message: str, details: dict | None = None) -> ModuleResponse:
    return ModuleResponse(success=False, data=None, error={"code": code, "message": message, "details": details or {}})