import { api } from "./axiosInstance";

async function deleteAllByUser(
  resource: string,
  userId: number
): Promise<void> {
  const response = await api.get<{ id: string }[]>(
    `/${resource}?userId=${userId}`
  );
  await Promise.all(
    response.data.map((item) => api.delete(`/${resource}/${item.id}`))
  );
}

async function deleteAllContributionsByUser(userId: number): Promise<void> {
  const response = await api.get<{ id: string }[]>(
    `/contributions?userId=${userId}`
  );
  await Promise.all(
    response.data.map((item) => api.delete(`/contributions/${item.id}`))
  );
}

export async function clearAllUserData(userId: number): Promise<void> {
  await Promise.all([
    deleteAllByUser("incomes", userId),
    deleteAllByUser("expenses", userId),
    deleteAllByUser("budgets", userId),
    deleteAllByUser("goals", userId),
    deleteAllContributionsByUser(userId),
  ]);
}