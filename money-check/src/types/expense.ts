import type { ExpenseCategory } from "./category";

export interface Expense {
  id: string;
  userId: number;
  amount: number;
  category: ExpenseCategory;
  date: string;
  comment: string;
}

export type CreateExpenseDto = Omit<Expense, "id">;
export type UpdateExpenseDto = Partial<Omit<Expense, "id" | "userId">>;