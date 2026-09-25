expenses = []

MENU_PROMPT = """
Enter 'a' to add expense
Enter 'l' to list expenses
Enter 'f' to find expense
Enter 't' to show total
Enter 'q' to quit
"""


def add():
    title = input("Enter expense title: ")
    amount = int(input("Enter the amount: "))
    category = input("Enter category: ")

    expense = {
        "title": title,
        "amount": amount,
        "category": category
    }

    expenses.append(expense)
    print("Expense added successfully!")


def show_expenses():
    for expense in expenses:
        print("Title:", expense["title"])
        print("Amount:", expense["amount"])
        print("Category:", expense["category"])
        print()


def find_expense():
    search_title = input("Enter expense title: ")

    for expense in expenses:
        if search_title == expense["title"]:
            print("Title:", expense["title"])
            print("Amount:", expense["amount"])
            print("Category:", expense["category"])
            return

    print("Expense not found.")


def total():
    total_amount = 0

    for expense in expenses:
        total_amount = total_amount + expense["amount"]

    print("Total:", total_amount)


def menu():
    selection = input(MENU_PROMPT)

    while selection != "q":
        if selection == "a":
            add()
        elif selection == "l":
            show_expenses()
        elif selection == "f":
            find_expense()
        elif selection == "t":
            total()
        else:
            print("Unknown command")

        selection = input(MENU_PROMPT)

    print("Goodbye!")


menu()