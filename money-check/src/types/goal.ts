export interface Goal {
  id: string;
  userId: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export type CreateGoalDto = Omit<Goal, "id">;
export type UpdateGoalDto = Partial<Omit<Goal, "id" | "userId">>;