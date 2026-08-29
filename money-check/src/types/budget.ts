import type { ExpenseCategory } from "./category";

export type BudgetPeriod = "week" | "month" | "year";

export interface Budget {
  id: string;
  userId: number;
  category: ExpenseCategory;
  limit: number;
  period: BudgetPeriod;
}

export type CreateBudgetDto = Omit<Budget, "id">;
export type UpdateBudgetDto = Partial<Omit<Budget, "id" | "userId">>;
