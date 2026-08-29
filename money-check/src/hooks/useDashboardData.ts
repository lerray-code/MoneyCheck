import { useEffect, useState } from "react";
import { getIncomes } from "../api/incomeApi";
import { getExpenses } from "../api/expenseApi";
import { getBudgets } from "../api/budgetApi";
import type { Income } from "../types/income";
import type { Expense } from "../types/expense";
import type { Budget } from "../types/budget";
import {
  calculateBalance,
  calculateBalanceHistory,
  filterByMonth,
  getCurrentYearMonth,
  groupByCategory,
  groupIncomeByMonth,
  sumAmounts,
} from "../utils/calculations";

export function useDashboardData(userId: number | undefined) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      const [incomesData, expensesData, budgetsData] = await Promise.all([
        getIncomes(userId!),
        getExpenses(userId!),
        getBudgets(userId!),
      ]);
      if (!cancelled) {
        setIncomes(incomesData);
        setExpenses(expensesData);
        setBudgets(budgetsData);
        setLoading(false);
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const currentYearMonth = getCurrentYearMonth();
  const monthIncomes = filterByMonth(incomes, currentYearMonth);
  const monthExpenses = filterByMonth(expenses, currentYearMonth);

  const totalBalance = calculateBalance(incomes, expenses);
  const monthIncomeTotal = sumAmounts(monthIncomes);
  const monthExpenseTotal = sumAmounts(monthExpenses);

  const budgetLimitTotal = sumAmounts(budgets.map((b) => ({ amount: b.limit })));
  const budgetRemaining = budgetLimitTotal - monthExpenseTotal;

  const expensesByCategory = groupByCategory(monthExpenses);
  const incomeByMonth = groupIncomeByMonth(incomes, 6);
  const balanceHistory = calculateBalanceHistory(incomes, expenses, 30);

  const recentTransactions = [...incomes, ...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  return {
    loading,
    incomes,
    expenses,
    budgets,
    totalBalance,
    monthIncomeTotal,
    monthExpenseTotal,
    budgetLimitTotal,
    budgetRemaining,
    expensesByCategory,
    incomeByMonth,
    balanceHistory,
    recentTransactions,
    reload: () => {
     
    },
  };
}