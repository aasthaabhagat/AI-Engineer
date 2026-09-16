def calculate_total(expenses):
    total = 0

    for expense in expenses:
        total += expense["amount"]

    return total


def category_summary(expenses):
    summary = {}

    for expense in expenses:
        category = expense["category"]
        amount = expense["amount"]

        if category not in summary:
            summary[category] = 0

        summary[category] += amount

    return summary


def highest_expense(expenses):
    if not expenses:
        return None

    return max(expenses, key=lambda expense: expense["amount"])


def lowest_expense(expenses):
    if not expenses:
        return None

    return min(expenses, key=lambda expense: expense["amount"])


def average_expense(expenses):
    if not expenses:
        return 0

    total = calculate_total(expenses)
    return total / len(expenses)


def expenses_above_amount(expenses, amount):
    return [
        expense
        for expense in expenses
        if expense["amount"] > amount
    ]