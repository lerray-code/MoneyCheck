import { useEffect, useState } from "react";
import { getIncomes } from "../api/incomeApi";
import { getExpenses } from "../api/expenseApi";
import type { Income } from "../types/income";
import type { Expense } from "../types/expense";
import type { AnalyticsPeriod } from "../types/analytics";
import {
  filterByPeriod,
  getTopCategories,
  calculateAverageCheck,
  findLargestTransaction,
  groupByCategory,
  groupExpensesByWeek,
  groupIncomeByMonth,
  calculateYearlyBalanceByMonth,
  sumAmounts,
} from "../utils/calculations";

export function useAnalytics(
  userId: number | undefined,
  period: AnalyticsPeriod
) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      const [incomesData, expensesData] = await Promise.all([
        getIncomes(userId!),
        getExpenses(userId!),
      ]);
      if (!cancelled) {
        setIncomes(incomesData);
        setExpenses(expensesData);
        setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const filteredIncomes = filterByPeriod(incomes, period);
  const filteredExpenses = filterByPeriod(expenses, period);
  const allFiltered = [...filteredIncomes, ...filteredExpenses].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const expensesByCategory = groupByCategory(filteredExpenses);
  const topCategories = getTopCategories(filteredExpenses, 5);
  const averageCheck = calculateAverageCheck(filteredExpenses);
  const largestPurchase = findLargestTransaction(filteredExpenses);
  const operationsCount = filteredIncomes.length + filteredExpenses.length;
  const totalExpenses = sumAmounts(filteredExpenses);
  const totalIncomes = sumAmounts(filteredIncomes);

  const expensesByWeek = groupExpensesByWeek(expenses, 8);
  const incomeDynamics = groupIncomeByMonth(incomes, 12);
  const yearlyBalance = calculateYearlyBalanceByMonth(incomes, expenses);

  return {
    loading,
    allTransactions: allFiltered,
    expensesByCategory,
    topCategories,
    averageCheck,
    largestPurchase,
    operationsCount,
    totalExpenses,
    totalIncomes,
    expensesByWeek,
    incomeDynamics,
    yearlyBalance,
  };
}