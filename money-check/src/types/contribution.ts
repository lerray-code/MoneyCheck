export interface Contribution {
  id: string;
  goalId: string;
  userId: number;
  amount: number;
  date: string; 
}

export type CreateContributionDto = Omit<Contribution, "id">;