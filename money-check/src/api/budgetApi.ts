import { api } from "./axiosInstance";
import type { Budget, CreateBudgetDto, UpdateBudgetDto } from "../types/budget";

export async function getBudgets(userId: number): Promise<Budget[]> {
  const response = await api.get<Budget[]>(`/budgets?userId=${userId}`);
  return response.data;
}

export async function createBudget(dto: CreateBudgetDto): Promise<Budget> {
  const response = await api.post<Budget>("/budgets", dto);
  return response.data;
}

export async function updateBudget(
  id: string,
  dto: UpdateBudgetDto
): Promise<Budget> {
  const response = await api.patch<Budget>(`/budgets/${id}`, dto);
  return response.data;
}

export async function deleteBudget(id: string): Promise<void> {
  await api.delete(`/budgets/${id}`);
}