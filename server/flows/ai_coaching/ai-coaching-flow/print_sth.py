from promptflow.core import tool

@tool
def print_sth(sth: str) -> None:
    print(sth)
