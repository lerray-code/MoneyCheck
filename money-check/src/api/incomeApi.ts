import { api } from "./axiosInstance";
import type { Income, CreateIncomeDto, UpdateIncomeDto } from "../types/income";

// Получить все доходы конкретного пользователя
export async function getIncomes(userId: number): Promise<Income[]> {
  const response = await api.get<Income[]>(`/incomes?userId=${userId}`);
  return response.data;
}

// Получить один доход по id
export async function getIncomeById(id: string): Promise<Income> {
  const response = await api.get<Income>(`/incomes/${id}`);
  return response.data;
}

// Создать новый доход
export async function createIncome(dto: CreateIncomeDto): Promise<Income> {
  const response = await api.post<Income>("/incomes", dto);
  return response.data;
}

// Обновить доход
export async function updateIncome(
  id: string,
  dto: UpdateIncomeDto
): Promise<Income> {
  const response = await api.patch<Income>(`/incomes/${id}`, dto);
  return response.data;
}

// Удалить доход
export async function deleteIncome(id: string): Promise<void> {
  await api.delete(`/incomes/${id}`);
}