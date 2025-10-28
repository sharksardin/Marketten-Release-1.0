import requests
import json
import pandas as pd
from datetime import datetime
from dateutil.relativedelta import relativedelta
from app.config.settings import settings

url = "https://openapi.naver.com/v1/datalab/search"
client_id = settings.CLIENT_ID
client_secret = settings.CLIENT_SECRET
content_type = "application/json"

headers = {
    "X-Naver-Client-Id":client_id,
    "X-Naver-Client-Secret":client_secret,
    "Content-Type":content_type
}

#키워드 트렌드 분석
def analyze_keywords(keywords: list) -> dict:
    start_date = datetime.today() - relativedelta(months=3)
    end_date = datetime.today()
    kw_groups = list()

    #키워드 복합어 분해 후 그룹화 ex)"무선 마우스" -> ["무선","마우스"]
    for kw in keywords:
        kw_sliced = kw.split(" ")
        kw_groups.append({"groupName": kw, "keywords": kw_sliced})

    data = {
        "startDate": start_date.strftime("%Y-%m-%d"),
        "endDate": end_date.strftime("%Y-%m-%d"),
        "timeUnit": "month",
        "keywordGroups": kw_groups
    }
    
    #트렌드 분석 요청
    response = requests.post(url, headers=headers, data=json.dumps(data)).json()

    #numpy로 각 키워드의 월별 트렌드 수치를 데이터프레임화, 이후 각 키워드 별 평균 트렌드 수치와 최고 트렌드 수치를 함께 반환
    try:
        data = dict()

        max_len = max(len(r["data"]) for r in response["results"])

        for r in response["results"]:
            ratios = list()
            for d in r["data"]:
                ratios.append(d["ratio"])

            if len(ratios) < max_len:
                ratios.extend([0] * (max_len - len(ratios)))

            data[r["title"]] = ratios
        df = pd.DataFrame(data)

        result = dict()
        for kw in keywords:
            result[kw] = {"평균 수치":round(df[kw].mean(),1),"최대 수치":round(df[kw].max(),1)}

        return result
    except Exception as e:
        raise Exception(str(e))