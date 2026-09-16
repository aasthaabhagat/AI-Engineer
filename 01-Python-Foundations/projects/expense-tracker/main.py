from data import load_expenses
from analyzer import (
    calculate_total,
    category_summary,
    highest_expense,
    lowest_expense,
    average_expense,
    expenses_above_amount,
)


def view_expenses(expenses):
    if not expenses:
        print("\nNo expenses found.")
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


def main():
    expenses = load_expenses()

    while True:
        print("\n===== Expense Analyzer =====")
        print("1. View expenses")
        print("2. Total spending")
        print("3. Category summary")
        print("4. Highest expense")
        print("5. Lowest expense")
        print("6. Average expense")
        print("7. Expenses above amount")
        print("8. Exit")

        choice = input("Choose an option: ")

        if choice == "1":
            view_expenses(expenses)

        elif choice == "2":
            total = calculate_total(expenses)
            print(f"\nTotal Spending: ₹{total:.2f}")

        elif choice == "3":
            summary = category_summary(expenses)

            print("\n===== Category Summary =====")

            for category, amount in summary.items():
                print(f"{category}: ₹{amount:.2f}")

        elif choice == "4":
            highest = highest_expense(expenses)

            if highest:
                print(
                    f"\nHighest Expense: "
                    f"₹{highest['amount']:.2f} - {highest['description']}"
                )
            else:
                print("\nNo expenses found.")

        elif choice == "5":
            lowest = lowest_expense(expenses)

            if lowest:
                print(
                    f"\nLowest Expense: "
                    f"₹{lowest['amount']:.2f} - {lowest['description']}"
                )
            else:
                print("\nNo expenses found.")

        elif choice == "6":
            average = average_expense(expenses)
            print(f"\nAverage Expense: ₹{average:.2f}")

        elif choice == "7":
            try:
                amount = float(input("Enter amount: "))

                results = expenses_above_amount(expenses, amount)

                if results:
                    print(f"\nExpenses above ₹{amount:.2f}:")

                    for expense in results:
                        print(
                            f"₹{expense['amount']:.2f} - "
                            f"{expense['category']} - "
                            f"{expense['description']}"
                        )
                else:
                    print("\nNo expenses found above that amount.")

            except ValueError:
                print("\nPlease enter a valid number.")

        elif choice == "8":
            print("Goodbye!")
            break

        else:
            print("Invalid option. Please choose 1-8.")


if __name__ == "__main__":
    main()