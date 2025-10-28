import os
import json
from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

#GPT API에 프롬프트 요청하고 응답 반환
def request_prompt(msg: list, func: dict) -> dict:
    response = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = msg,
        functions = [
            func
        ],
        function_call = {"name": func["name"]}
    )

    return json.loads(response.choices[0].message.function_call.arguments)