import { useEffect, useState } from "react";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../api/goalApi";
import {
  getContributionsByUser,
  createContribution,
  deleteContributionsByGoal,
} from "../api/contributionApi";
import type { Goal, CreateGoalDto, UpdateGoalDto } from "../types/goal";
import type { Contribution } from "../types/contribution";
import { calculateGoalForecast } from "../utils/calculations";

export function useGoals(userId: number | undefined) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      const [goalsData, contributionsData] = await Promise.all([
        getGoals(userId!),
        getContributionsByUser(userId!),
      ]);
      if (!cancelled) {
        setGoals(goalsData);
        setContributions(contributionsData);
        setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  function getForecastForGoal(goal: Goal) {
    const goalContributions = contributions.filter(
      (c) => c.goalId === goal.id
    );
    return calculateGoalForecast(goal, goalContributions);
  }

  async function addGoal(dto: CreateGoalDto) {
    const created = await createGoal(dto);
    setGoals((prev) => [...prev, created]);
  }

  async function editGoal(id: string, dto: UpdateGoalDto) {
    const updated = await updateGoal(id, dto);
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  }

  async function removeGoal(id: string) {
    await deleteContributionsByGoal(id);
    await deleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setContributions((prev) => prev.filter((c) => c.goalId !== id));
  }

  async function replenishGoal(
    goal: Goal,
    userIdParam: number,
    amount: number,
    date: string
  ) {
    const contribution = await createContribution({
      goalId: goal.id,
      userId: userIdParam,
      amount,
      date,
    });
    const updatedGoal = await updateGoal(goal.id, {
      currentAmount: goal.currentAmount + amount,
    });

    setContributions((prev) => [...prev, contribution]);
    setGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
    );
  }

  return {
    goals,
    loading,
    getForecastForGoal,
    addGoal,
    editGoal,
    removeGoal,
    replenishGoal,
  };
}