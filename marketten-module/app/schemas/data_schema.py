from pydantic import BaseModel, Field
from typing import List

#본문 생성 키워드 분석 시 입력값
class ContentKeywordsInput(BaseModel):
    product_info: str = Field(..., alias="productInfo")
    product_features: str = Field(..., alias="productFeatures")
    user_experience: str = Field(..., alias="userExperience")

    class Config:
        allow_population_by_field_name = True  # 내부에서 field_name으로도 접근 가능

#본문 생성 시 입력값
class ContentInput(BaseModel):
    product_info: str = Field(..., alias="productInfo")
    product_features: str = Field(..., alias="productFeatures")
    user_experience: str = Field(..., alias="userExperience")
    selected_tone: str = Field(..., alias="selectedTone")
    tone_preview: str = Field(..., alias="tonePreview")
    keywords: str = Field(..., alias="keywords")

    class Config:
        allow_population_by_field_name = True  # 내부에서 snake_case로 접근 가능

#제목 생성 키워드 분석 시 입력값
class TitleKeywordsInput(BaseModel):
    generated_content: str = Field(..., alias="generatedContent")

    class Config:
        allow_population_by_field_name = True  # 내부에서 field_name으로도 접근 가능

#제목 생성 시 입력값
class TitleInput(BaseModel):
    keywords: str = Field(..., alias="keywords")
    generated_content: str = Field(..., alias="generatedContent")

    class Config:
        validate_by_name = True  # v2 대응
        # alias 사용 가능, 내부에서는 generated_content 로 접근 가능