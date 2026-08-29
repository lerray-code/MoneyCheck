import type { Income } from "./income";
import type { Expense } from "./expense";

// Общий тип - либо доход, либо расход, оба имеют одинаковую "форму"
export type Transaction = Income | Expense;

export type TransactionType = "income" | "expense";

export type SortField = "date" | "amount" | "category";
export type SortDirection = "asc" | "desc";