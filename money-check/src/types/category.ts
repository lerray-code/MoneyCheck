export const INCOME_CATEGORIES = [
  "Зарплата",
  "Фриланс",
  "Подарок",
  "Проценты",
  "Другое",
] as const;

export const EXPENSE_CATEGORIES = [
  "Еда",
  "Транспорт",
  "Жильё",
  "Развлечения",
  "Здоровье",
  "Одежда",
  "Другое",
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];