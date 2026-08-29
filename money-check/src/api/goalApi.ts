import { api } from "./axiosInstance";
import type { Goal, CreateGoalDto, UpdateGoalDto } from "../types/goal";

export async function getGoals(userId: number): Promise<Goal[]> {
  const response = await api.get<Goal[]>(`/goals?userId=${userId}`);
  return response.data;
}

export async function createGoal(dto: CreateGoalDto): Promise<Goal> {
  const response = await api.post<Goal>("/goals", dto);
  return response.data;
}

export async function updateGoal(
  id: string,
  dto: UpdateGoalDto
): Promise<Goal> {
  const response = await api.patch<Goal>(`/goals/${id}`, dto);
  return response.data;
}

export async function deleteGoal(id: string): Promise<void> {
  await api.delete(`/goals/${id}`);
}