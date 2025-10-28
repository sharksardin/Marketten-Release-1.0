from app.schemas.data_schema import ContentInput
from app.services.gpt_service import request_prompt as rp

#본문 생성 프롬프트 요청 - 1차로 소주제 생성 후 2차로 본문 작성
async def generate_content(data: ContentInput):
    sprompt = """
    [Style]
    마케팅 전문가이자 전문 블로거
    """

    topics_uprompt = f"""
    <<상품명>>
    {data.product_info}
    <<상품 특징>>
    {data.product_features}
    <<사용자 경험>>
    {data.user_experience}
    <<키워드>>
    {data.keywords}
    ---
    [Context]
    위 설명에 있는 상품을 마케팅하는 블로그 글을 작성하려고 해. 글의 내용이 마케팅이라는 목적이 명확하게 보이는 내용보다는 독자들의 흥미를 자연스럽게 유도할 수 있는 내용이었으면 좋겠어.
    [Objective]
    상품 특징, 사용자 경험, 키워드를 기반으로 상품과 관련해서 독자들에게 흥미롭고 유익한 정보가 될만한 글의 소주제를 구성해줘.
    [Audience]
    상품 관련 정보를 일부러 찾다가 읽게 될 독자, 별 생각 없이 웹서핑을 하다가 읽게 될 독자
    [Response]
    -간결한 한 문장의 소주제 리스트 형식
    -소주제는 상품 특징 소개에 적절하도록
    -5가지 소주제를 응답
    """

    topics_func = {
            "name" : "generate_topics",
            "description" : "generate topics",
            "parameters" : {
                "type" : "object",
                "properties" : {
                    "topics" : {"type" : "array", "items": {"type": "string"}, "description" : "topics generated"}
                },
                "required" : ["topics"]
            }
        }
    
    topics_messages = [
        {
            "role": "system",
            "content": sprompt
        },
        {
            "role": "user",
            "content": topics_uprompt
        }
    ]

    topics_response = rp(msg = topics_messages, func = topics_func)

    content_uprompt = f"""
    <<상품명>>
    {data.product_info}
    <<상품 특징>>
    {data.product_features}
    <<사용자 경험>>
    {data.user_experience}
    <<키워드>>
    {data.keywords}
    <<톤>>
    {data.selected_tone}
    예문)
    {data.tone_preview}
    ---
    [Context]
    위 설명에 있는 상품을 마케팅하는 블로그 글을 작성하려고 해. 글의 내용이 마케팅이라는 목적이 명확하게 보이는 내용보다는 독자들의 흥미를 자연스럽게 유도할 수 있는 내용이었으면 좋겠어.
    [Objective]
    상품 특징, 사용자 경험, 키워드를 기반으로 이전에 제시해준 소주제 구성에 맞춰 상품을 마케팅하는 블로그 글을 작성해줘. 글을 작성할 때, 톤을 적용해줘. 톤의 예문은 참고만 하고 내용을 글에 직접적으로 사용하지는 마.
    [Audience]
    상품 관련 정보를 일부러 찾다가 읽게 될 독자, 별 생각 없이 웹서핑을 하다가 읽게 될 독자
    [Response]
    -글의 구성은 서론-본론-결론. 본론은 소주제 구성으로 채움. 서론, 본론, 결론을 명시적으로 표기하지 않음. 제시된 소주제만 명시적으로 표기
    -글의 대제목은 포함하지 않는다.
    -단순 마케팅 목적의 글이 아닌 자연스러운 내용으로 작성한다.
    -상품의 특징, 사용자의 경험이 명확히 나타나야 한다.
    -요구된 키워드가 내용에 포함되어야 하며, 키워드와 관련된 상품의 내용이 강조되어야 한다.
    -응답 형태는 마크다운 문법 형태로 응답한다.
    -글의 길이는 마크다운 문법 요소를 제외하고 5000자 이하로 맞춰 작성한다.
    """

    content_func = {
            "name" : "write_content",
            "description" : "write content",
            "parameters" : {
                "type" : "object",
                "properties" : {
                    "content" : {"type" : "string", "description" : "content written"}
                },
                "required" : ["content"]
            }
        }
    
    content_messages = [
        {
            "role" : "system",
            "content": sprompt
        },
        {
            "role": "user",
            "content": topics_uprompt
        },
        {
            "role": "assistant",
            "content": f"{topics_response['topics']}"
        },
        {
            "role": "user",
            "content": content_uprompt
        }
    ]

    return rp(msg = content_messages, func = content_func)