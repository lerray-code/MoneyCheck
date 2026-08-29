import { api } from "./axiosInstance";
import type {
  Contribution,
  CreateContributionDto,
} from "../types/contribution";

export async function getContributionsByGoal(
  goalId: string
): Promise<Contribution[]> {
  const response = await api.get<Contribution[]>(
    `/contributions?goalId=${goalId}`
  );
  return response.data;
}

export async function getContributionsByUser(
  userId: number
): Promise<Contribution[]> {
  const response = await api.get<Contribution[]>(
    `/contributions?userId=${userId}`
  );
  return response.data;
}

export async function createContribution(
  dto: CreateContributionDto
): Promise<Contribution> {
  const response = await api.post<Contribution>("/contributions", dto);
  return response.data;
}

export async function deleteContributionsByGoal(
  goalId: string
): Promise<void> {
  const contributions = await getContributionsByGoal(goalId);
  await Promise.all(
    contributions.map((c) => api.delete(`/contributions/${c.id}`))
  );
}