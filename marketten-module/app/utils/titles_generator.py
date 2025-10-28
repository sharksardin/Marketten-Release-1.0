from app.schemas.data_schema import TitleInput
from app.services.gpt_service import request_prompt as rp

#제목 리스트 생성 프롬프트 요청
def generate_titles(data: TitleInput):
    sprompt = """
    [Role]
    너는 전문 마케팅 블로거야.
    [Steps]
    1.본문의 내용을 분석한다.
    2.분석된 내용과 키워드들을 통해 블로그 글의 제목 리스트를 생성해 제시한다.
    [Narrow]
    -제시되는 제목의 개수는 5개
    -제목은 키워드와 관련된 본문의 핵심 내용을 함축적으로 포함
    -독자들이 흥미를 가질 만한 제목을 생성
    """

    uprompt = f"""
    <<키워드>>
    {data.keywords}
    <<본문>>
    {data.generated_content}
    ---
    [Instruction]
    위의 키워드와 본문 내용을 기반으로 어울리는 제목 리스트를 제시해줘.
    [End Goal]
    브라우저의 검색 엔진에 자주 노출될 수 있는 키워드가 포함된 블로그 글의 제목을 작성하려는 것이 목표야.
    """

    func = {
        "name":"generate_titles",
        "description":"generate titles from the input values",
        "parameters":{
            "type":"object",
            "properties":{
                "titles":{"type":"array","items":{"type":"string"},"description":"titles generated"}
            }
        },
        "required":["titles"]
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