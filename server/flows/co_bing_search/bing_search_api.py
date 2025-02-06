from promptflow import tool

# The inputs section will change based on the arguments of the tool function, after you save the code
# Adding type to arguments and return value will help the system show the types properly
# Please update the function name/signature per need

# In Python tool you can do things like calling external services or
# pre/post processing of data, pretty much anything you want

import os
import json
import requests
from openai import AzureOpenAI
from dotenv import load_dotenv
load_dotenv()

client = AzureOpenAI(
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT","").strip(),
    api_key        = os.getenv("AZURE_OPENAI_API_KEY"),
    api_version    = os.getenv("OPENAI_API_VERSION")
)

deployment_name = os.getenv('DEPLOYMENT_NAME')

# 검색을 위해 필요한 정보를 추출하는 함수 정의
def get_search_info(input_query):
    system_prompt='''
    Answer the following questions as best you can. You have access to the following tools: You can only Korean language.
    Web Search: Use the web to find information
    Question: Natural language-based questions that users want to ask through web searches
    Answer: Describes how to effectively answer people's natural language-based questions and creates optimized search keywords needed for use in the Bing Search API. And create optimized search keywords needed for use in the Bing Search API. The answer format must strictly follow the JSON format below.
    {"Keywords": "Specify three sets of keywords information to search for key data that matches the user's question intent."}
    '''
    user_prompt = f'''
    Question: {input_query}
    '''

    # Azure OpenAI GPT를 프롬프트 엔지니어링의 Few-shot 예시
    prompt = [{"role":"system", "content":system_prompt},
                {"role":"user", "content":"Question: 2024년 한국 총선 날짜가 언제인지 회사를 안 가도 되는지 알려줘."},
                {"role":"assistant", "content":"""{"Keywords": "2024년 한국 총선 날짜 + 2024년 총선 공휴일 여부 + 총선 투표일 휴무 정책"}"""},
                {"role":"user","content": user_prompt}
            ]
        
    response = client.chat.completions.create(
        model=deployment_name,
        messages = prompt,
        max_tokens=600,
        response_format={"type": "json_object"}
    )

    keywords = json.loads(response.choices[0].message.content)['Keywords']
    
    # 만약 keywords가 list 형태일 경우, '+' 문자로 join하여 반환
    if type(keywords) == list:
        keywords = ' + '.join(keywords)

    return json.loads(response.choices[0].message.content)['Keywords']

# Bing search API를 이용하여 검색 결과를 가져오는 함수 정의
def get_search_result(keywords):
    subscription_key = os.getenv("BING_SEARCH_KEY")
    endpoint = os.getenv("BING_SEARCH_ENDPOINT") + "/v7.0/search"

    query = keywords

    # Construct a request
    mkt = 'ko_KR'
    params = { 'q': query, 'mkt': mkt }
    headers = { 'Ocp-Apim-Subscription-Key': subscription_key }

    # Call the API
    response = requests.get(endpoint, headers=headers, params=params)

    context = ''
    for result in response.json()['webPages']['value']:
        context += result['snippet'] + '\n'

    return context

# 검색 결과를 기반으로 사용자의 질문에 대한 답을 생성하는 함수 정의
def generate_answer(input_query, context):
    system_prompt = """You are an agent who answers the user's questions based on the data provided. You can only Korean language."""
    user_prompt = f"""Question: {input_query}
    Web Search Results: {context}
    Answer: 
    """

    response = client.chat.completions.create(
        model=deployment_name,
        messages = [
            {"role":"system", "content":system_prompt},
            {"role":"user","content": user_prompt}
        ],
        max_tokens=600
    )

    return response.choices[0].message.content

# 사용자로부터 검색 질의어를 입력받아서 결과를 출력하는 함수 정의
def get_input_query(input_query):
    # 검색 질의어 출력
    print("-"*80)
    print("검색질의어: " + input_query)
    print("-"*80)

    # 검색 키워드를 추출하는 함수 호출
    keywords = get_search_info(input_query)
    print("검색키워드: " + keywords)
    print("-"*80)

    # 검색 결과를 가져오는 함수 호출
    context = get_search_result(keywords)
    print("검색결과: " + context)
    print("-"*80)

    # 사용자에게 제공할 답변을 생성하는 함수 호출
    answer = generate_answer(input_query, context)
    print("최종답변: " + answer)
    print("-"*80)

    return answer

@tool
def result(input: str) -> dict:
    input_query = f"{input} 기업에 대한 2025년 동향 알려줘"
    result = get_input_query(input_query)
    return result
