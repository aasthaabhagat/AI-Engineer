import json
from pathlib import Path
from datetime import date, datetime


FILE_PATH = Path("expenses.json")


def load_expenses():
    try:
        with open(FILE_PATH, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []


def save_expenses(expenses):
    with open(FILE_PATH, "w") as file:
        json.dump(expenses, file, indent=4)


def get_valid_date():
    while True:
        user_date = input(
            "Date (DD-MM-YY, press Enter for today): "
        ).strip()

        if not user_date:
            return date.today().isoformat()

        for date_format in ("%d-%m-%y", "%d-%m-%Y", "%d/%m/%y", "%d/%m/%Y"):
            try:
                parsed_date = datetime.strptime(user_date, date_format)
                return parsed_date.date().isoformat()
            except ValueError:
                continue

        print("Please enter a valid date.")


def add_expense(expenses):
    while True:
        try:
            amount = float(input("Amount: "))

            if amount <= 0:
                print("Amount must be greater than 0.")
                continue

            break

        except ValueError:
            print("Please enter a valid number.")

    category = input("Category: ")
    description = input("Description: ")
    date_value = get_valid_date()

    expense = {
        "amount": amount,
        "category": category,
        "description": description,
        "date": date_value
    }

    expenses.append(expense)
    save_expenses(expenses)

    print("Expense added successfully.")


def view_expenses(expenses):
    if not expenses:
        print("No expenses found.")
        return

    print("\n===== All Expenses =====")
    print(f"{'No.':<5}{'Amount':<12}{'Category':<15}{'Description':<21}{'Date'}")
    print("-" * 71)

    for index, expense in enumerate(expenses, start=1):
        print(
            f"{index:<5}"
            f"₹{expense['amount']:<11.2f}"
            f"{expense['category']:<15}"
            f"{expense['description']:<21}"
            f"{expense['date']}"
        )


def calculate_total(expenses):
    total = 0

    for expense in expenses:
        total += expense["amount"]

    print(f"\nTotal Spending: ₹{total:.2f}")


def category_summary(expenses):
    summary = {}

    for expense in expenses:
        category = expense["category"]
        amount = expense["amount"]

        if category not in summary:
            summary[category] = 0

        summary[category] += amount

    print("\n===== Category Summary =====")

    for category, total in summary.items():
        print(f"{category}: ₹{total:.2f}")


def main():
    expenses = load_expenses()

    while True:
        print("\n===== Expense Tracker =====")
        print("1. Add Expense")
        print("2. View Expenses")
        print("3. Total Spending")
        print("4. Category Summary")
        print("5. Exit")

        choice = input("Choose an option: ")

        if choice == "1":
            add_expense(expenses)
        elif choice == "2":
            view_expenses(expenses)
        elif choice == "3":
            calculate_total(expenses)
        elif choice == "4":
            category_summary(expenses)
        elif choice == "5":
            print("Goodbye!")
            break
        else:
            print("Invalid option. Please choose 1-5.")


if __name__ == "__main__":
    main()