from pathlib import Path

file_path = Path("does_not_exist.json")

try:
    with open(file_path, "r") as file:
        data = file.read()
        print(data)
except FileNotFoundError:
    print("File was not found.")