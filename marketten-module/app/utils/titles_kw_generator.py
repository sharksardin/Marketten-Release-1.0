from app.schemas.data_schema import TitleKeywordsInput
from app.services.gpt_service import request_prompt as rp

#제목 리스트 생성을 위한 키워드 분석 프롬프트 요청
def generate_titles_kw(data: TitleKeywordsInput):
    sprompt = """
    [Role]
    너는 전문 마케팅 블로거야.
    [Steps]
    1.본문에 대한 내용을 분석
    2.분석한 내용을 기반으로 키워드 제시
    [Narrow]
    -키워드 제시에 상품명은 직접적으로 반영하지 않음
    -키워드는 분석한 내용의 핵심을 포함
    -키워드는 간결한 형태를 유지
    -키워드는 명사 형태로 제시
    -제시되는 키워드의 개수는 5개
    """

    uprompt = f"""
    <<본문>>
    {data.generated_content}
    ---
    [Instruction]
    위에 나온 본문의 내용을 분석하여 키워드를 제시해줘.
    [End Goal]
    브라우저의 검색 엔진에 자주 노출될 수 있는 키워드가 포함된 블로그 글의 제목을 작성하려는 것이 목표야.
    """

    func = {
        "name":"get_keywords",
        "description":"get keywords from the input values to generate titles",
        "parameters":{
            "type":"object",
            "properties":{
                "keywords":{"type":"array","items":{"type":"string"},"description":"keywords analyzed"}
            }
        },
        "required":["keywords"]
    }

    messages = [
        {
            "role": "system",
            "content": sprompt
        },
        {
            "role": "user",
            "content": uprompt
        }
    ]

    return rp(msg = messages, func = func)