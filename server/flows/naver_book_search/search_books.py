from promptflow import tool
import requests  
# The inputs section will change based on the arguments of the tool function, after you save the code
# Adding type to arguments and return value will help the system show the types properly
# Please update the function name/signature per need

# In Python tool you can do things like calling external services or
# pre/post processing of data, pretty much anything you want

def search_books(keyword, client_id, client_secret):  
    url = "https://openapi.naver.com/v1/search/book.json"  
    headers = {  
        "X-Naver-Client-Id": client_id,  
        "X-Naver-Client-Secret": client_secret  
    }  
    params = {  
        "query": keyword,  
        "display": 100  # 검색 결과 출력 건수 지정 (최대 100)  
    }  
  
    response = requests.get(url, headers=headers, params=params)  
  
    if response.status_code == 200:  
        result = response.json()  
        return result['items']  
    else:  
        print("Error Code:", response.status_code)  
        return None  
    
@tool
def naver_book_search(input: str) -> dict:
    # Naver Developers에서 발급받은 자신의 클라이언트 ID와 시크릿을 입력하세요.  
    client_id = "IDHd82yKTIQpKEKPg_Vm"  
    client_secret = "T5cX2Mr7BR"  
    
    # 검색할 키워드를 입력하세요.  
    keyword = input

    # 도서 검색 실행  
    books = search_books(keyword, client_id, client_secret)  
    print(books)
    # 검색 결과 출력  
    if books:  
        for book in books:  
            print(f"Title: {book['title']}, Author: {book['author']}, Publisher: {book['publisher']}, Link: {book['link']}, description: {book['description']}")  
    else:  
        print("No results found.")

    return books
