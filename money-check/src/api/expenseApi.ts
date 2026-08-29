import { api } from "./axiosInstance";
import type {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
} from "../types/expense";

export async function getExpenses(userId: number): Promise<Expense[]> {
  const response = await api.get<Expense[]>(`/expenses?userId=${userId}`);
  return response.data;
}

export async function getExpenseById(id: string): Promise<Expense> {
  const response = await api.get<Expense>(`/expenses/${id}`);
  return response.data;
}

export async function createExpense(
  dto: CreateExpenseDto
): Promise<Expense> {
  const response = await api.post<Expense>("/expenses", dto);
  return response.data;
}

export async function updateExpense(
  id: string,
  dto: UpdateExpenseDto
): Promise<Expense> {
  const response = await api.patch<Expense>(`/expenses/${id}`, dto);
  return response.data;
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}