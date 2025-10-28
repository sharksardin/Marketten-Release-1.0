from fastapi import APIRouter, HTTPException, status, Form ,Body
from app.schemas.data_schema import ContentKeywordsInput, ContentInput, TitleKeywordsInput, TitleInput
from app.schemas.resp_schema import succeed, fail
from app.utils.content_kw_generator import generate_content_kw
from app.utils.content_generator import generate_content
from app.utils.titles_kw_generator import generate_titles_kw
from app.utils.titles_generator import generate_titles
from app.utils.kw_trend_analyzer import analyze_keywords

router = APIRouter(prefix = "/gpt", tags = ["MKT-Module"])

# 본문 생성을 위한 키워드 분석 (input: 상품명, 상품 특징, 사용자 경험)
@router.post("/content/keywords")
async def analyze_content_keywords_ep(input: ContentKeywordsInput = Body(...)):
    # input.product_info, input.product_features, input.user_experience 사용
    kw = generate_content_kw(input)
    try:
        resp = analyze_keywords(kw["keywords"])
        return succeed(resp).model_dump()
    except Exception as e:
        return fail("NAVER_DATALAB_API_ERROR", "키워드 트렌드 분석 실패", {"reason": str(e)}).model_dump()

#본문 생성 (input: 상품명, 상품 특징, 사용자 경험, 어투, 어투 예문, 선택 키워드)
@router.post("/content")
async def generate_content_ep(data: ContentInput = Body(...)):
    # keywords는 string -> 리스트로 변환 필요하면
    if isinstance(data.keywords, str):
        kw_list = [kw.strip() for kw in data.keywords.split(",")]
        data.keywords = kw_list

    resp = await generate_content(data)
    return succeed(resp).model_dump()

# 제목 리스트 생성을 위한 키워드 분석 (input: 본문)
@router.post("/titles/keywords")
async def analyze_title_keywords_ep(
    data: TitleKeywordsInput = Body(...)
):
    # data.generated_content 로 접근 가능
    kw = generate_titles_kw(data)
    try:
        resp = analyze_keywords(kw["keywords"])
        return succeed(resp).model_dump()
    except Exception as e:
        return fail("NAVER_DATALAB_API_ERROR", "키워드 트렌드 분석 실패", {"reason": str(e)}).model_dump()

#제목 리스트 생성 (input: 본문, 선택 키워드)
@router.post("/titles")
async def generate_titles_ep(
    data: TitleInput = Body(...)
):
    # 콤마로 나뉜 키워드 리스트 처리
    kw_list = [kw.strip() for kw in data.keywords.split(",")]

    # 새 TitleInput 생성 (alias 매핑 유지)
    new_data = TitleInput(
        keywords=",".join(kw_list),
        generated_content=data.generated_content
    )

    resp = generate_titles(new_data)  # 기존 generate_titles 함수 호출
    return succeed(resp).model_dump()