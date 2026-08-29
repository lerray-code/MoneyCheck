import type { IncomeCategory } from "./category";

export interface Income {
  id: string;
  userId: number;
  amount: number;
  category: IncomeCategory;
  date: string;
  comment: string;
}

// Тип для создания записи - без id, он придёт от json-server
export type CreateIncomeDto = Omit<Income, "id">;

// Тип для обновления - все поля кроме id опциональны
export type UpdateIncomeDto = Partial<Omit<Income, "id" | "userId">>;