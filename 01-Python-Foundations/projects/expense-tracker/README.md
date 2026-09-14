# Expense Tracker CLI

A simple command-line expense tracker built with Python.

## Features

* Add an expense with:

  * Amount
  * Category
  * Description
  * Date
* View all expenses
* Calculate total spending
* View spending by category
* Save expenses to a JSON file
* Load saved expenses when the program starts
* Handle invalid amounts
* Handle invalid menu choices
* Handle missing or empty JSON files
* Accept flexible date formats
* Automatically use today's date when no date is entered

## Project Structure

```text
expense-tracker/
├── expense_tracker.py
├── expenses.json
├── experiments.py
└── README.md
```

## How to Run

Make sure you are inside the `expense-tracker` folder.

Run:

```bash
python expense_tracker.py
```

## Example

```text
===== Expense Tracker =====
1. Add Expense
2. View Expenses
3. Total Spending
4. Category Summary
5. Exit

Choose an option: 1

Amount: 2000
Category: groceries
Description: oil atta dal veggies
Date (DD-MM-YY, press Enter for today): 09/09/26

Expense added successfully.
```

## Data Storage

Expenses are stored in:

```text
expenses.json
```

The program loads the existing expenses when it starts and saves the updated list whenever a new expense is added.

## What I Implemented

This project was built while learning Python file handling and the standard library.

Concepts practiced:

* `json`
* `pathlib`
* Reading files
* Writing files
* Loading JSON data
* Saving JSON data
* Working with file paths
* Exception handling
* `try` / `except`
* Lists
* Dictionaries
* Loops
* Functions
* User input
* Basic input validation
* Date handling
* Building a CLI application
