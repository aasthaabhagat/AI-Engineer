import json
from pathlib import Path


FILE_PATH = Path(__file__).parent / "expenses.json"


def load_expenses():
    try:
        with open(FILE_PATH, "r") as file:
            return json.load(file)

    except FileNotFoundError:
        return []

    except json.JSONDecodeError:
        return []