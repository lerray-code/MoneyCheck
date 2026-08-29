import type { Income } from "../types/income";
import type { Expense } from "../types/expense";
import type { Budget, BudgetPeriod } from "../types/budget";
import type { AnalyticsPeriod } from "../types/analytics";
import type { Goal } from "../types/goal";
import type { Contribution } from "../types/contribution";
import { getLocalDateString } from "./date";


export function getCurrentYearMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function sumAmounts(items: { amount: number }[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function filterByMonth<T extends { date: string }>(
  items: T[],
  yearMonth: string
): T[] {
  return items.filter((item) => item.date.startsWith(yearMonth));
}

export function calculateBalance(incomes: Income[], expenses: Expense[]): number {
  return sumAmounts(incomes) - sumAmounts(expenses);
}

// Группировка расходов по категориям - для Pie Chart
export function groupByCategory(
  items: { category: string; amount: number }[]
): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item.category, (map.get(item.category) ?? 0) + item.amount);
  }
  return Array.from(map, ([name, value]) => ({ name, value }));
}

// Группировка доходов по месяцам - для Bar Chart. Возвращает последние N месяцев по порядку.
export function groupIncomeByMonth<T extends { date: string; amount: number }>(
  incomes: T[],
  monthsCount = 6
): { month: string; total: number }[]  {
  const now = new Date();
  const result: { month: string; total: number }[] = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yearMonth = d.toISOString().slice(0, 7);
    const label = d.toLocaleDateString("ru-RU", {
      month: "short",
      year: "2-digit",
    });
    const total = sumAmounts(filterByMonth(incomes, yearMonth));
    result.push({ month: label, total });
  }

  return result;
}

// Изменение баланса день за днём за последние N дней - для Line Chart
export function calculateBalanceHistory(
  incomes: Income[],
  expenses: Expense[],
  daysCount = 30
): { date: string; balance: number }[] {
  const now = new Date();
  const result: { date: string; balance: number }[] = [];

  // Считаем баланс на старте периода
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - daysCount + 1);
  const startDateStr = getLocalDateString(startDate);

  let runningBalance =
    sumAmounts(incomes.filter((t) => t.date < startDateStr)) -
    sumAmounts(expenses.filter((t) => t.date < startDateStr));

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = getLocalDateString(d);

    const dayIncome = sumAmounts(incomes.filter((t) => t.date === dateStr));
    const dayExpense = sumAmounts(expenses.filter((t) => t.date === dateStr));
    runningBalance += dayIncome - dayExpense;

    result.push({
      date: d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
      balance: runningBalance,
    });
  }

  return result;
}

// Возвращает дату начала текущего периода
export function getPeriodStartDate(period: BudgetPeriod): string {
  const now = new Date();

  if (period === "week") {
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + 1);
    return getLocalDateString(monday);
  }

  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
  }


  return getLocalDateString(new Date(now.getFullYear(), 0, 1));
}

// Сколько потрачено по конкретному бюджету за его текущий период
export function calculateSpentForBudget(
  budget: Budget,
  expenses: Expense[]
): number {
  const startDate = getPeriodStartDate(budget.period);
  const relevant = expenses.filter(
    (e) => e.category === budget.category && e.date >= startDate
  );
  return sumAmounts(relevant);
}

// Дата начала периода для фильтрации аналитики
export function getAnalyticsStartDate(period: AnalyticsPeriod): string | null {
  const now = new Date();

  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return getLocalDateString(d);
  }
  if (period === "month") {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 1);
    return getLocalDateString(d);
  }
  if (period === "quarter") {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 3);
    return getLocalDateString(d);
  }
  if (period === "year") {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() - 1);
    return getLocalDateString(d);
  }
  return null;
}

export function filterByPeriod<T extends { date: string }>(
  items: T[],
  period: AnalyticsPeriod
): T[] {
  const startDate = getAnalyticsStartDate(period);
  if (!startDate) return items;
  return items.filter((item) => item.date >= startDate);
}

// Топ категорий по сумме (по убыванию)
export function getTopCategories(
  items: { category: string; amount: number }[],
  limit = 5
): { name: string; value: number }[] {
  return groupByCategory(items)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

// Средний чек
export function calculateAverageCheck(items: { amount: number }[]): number {
  if (items.length === 0) return 0;
  return sumAmounts(items) / items.length;
}

// Самая большая покупка
export function findLargestTransaction<T extends { amount: number }>(
  items: T[]
): T | null {
  if (items.length === 0) return null;
  return items.reduce((max, item) => (item.amount > max.amount ? item : max));
}

// Расходы по неделям - последние N недель
export function groupExpensesByWeek(
  expenses: { date: string; amount: number }[],
  weeksCount = 8
): { week: string; total: number }[] {
  const now = new Date();
  const result: { week: string; total: number }[] = [];

  for (let i = weeksCount - 1; i >= 0; i--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - i * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);

    const startStr = getLocalDateString(weekStart);
    const endStr = getLocalDateString(weekEnd);

    const total = sumAmounts(
      expenses.filter((e) => e.date >= startStr && e.date <= endStr)
    );

    const label = weekStart.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });

    result.push({ week: label, total });
  }

  return result;
}

// Баланс за год по месяцам 
export function calculateYearlyBalanceByMonth(
  incomes: { date: string; amount: number }[],
  expenses: { date: string; amount: number }[]
): { month: string; balance: number }[] {
  const now = new Date();
  const result: { month: string; balance: number }[] = [];

  const yearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const yearAgoStr = getLocalDateString(yearAgo);

  let runningBalance =
    sumAmounts(incomes.filter((t) => t.date < yearAgoStr)) -
    sumAmounts(expenses.filter((t) => t.date < yearAgoStr));

  for (let i = 0; i < 12; i++) {
    const d = new Date(yearAgo.getFullYear(), yearAgo.getMonth() + i, 1);
    const yearMonth = d.toISOString().slice(0, 7);
    const label = d.toLocaleDateString("ru-RU", {
      month: "short",
      year: "2-digit",
    });

    const monthIncome = sumAmounts(filterByMonth(incomes, yearMonth));
    const monthExpense = sumAmounts(filterByMonth(expenses, yearMonth));
    runningBalance += monthIncome - monthExpense;

    result.push({ month: label, balance: runningBalance });
  }

  return result;
}

export interface GoalForecast {
  isAchievable: boolean; // есть ли вообще положительный темп накоплений
  isAlreadyReached: boolean;
  daysRemaining: number | null;
  forecastDate: string | null;
  averagePerDay: number;
}

export function calculateGoalForecast(
  goal: Goal,
  contributions: Contribution[]
): GoalForecast {
  const remaining = goal.targetAmount - goal.currentAmount;

  if (remaining <= 0) {
    return {
      isAchievable: true,
      isAlreadyReached: true,
      daysRemaining: 0,
      forecastDate: null,
      averagePerDay: 0,
    };
  }

  if (contributions.length === 0) {
    return {
      isAchievable: false,
      isAlreadyReached: false,
      daysRemaining: null,
      forecastDate: null,
      averagePerDay: 0,
    };
  }

  const sortedDates = contributions.map((c) => c.date).sort();
  const firstDate = new Date(sortedDates[0]);
  const today = new Date();

  // Количество дней от первого пополнения до сегодня
  const daysPassed = Math.max(
    1,
    Math.ceil((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const totalContributed = sumAmounts(contributions);
  const averagePerDay = totalContributed / daysPassed;

  if (averagePerDay <= 0) {
    return {
      isAchievable: false,
      isAlreadyReached: false,
      daysRemaining: null,
      forecastDate: null,
      averagePerDay: 0,
    };
  }

  const daysRemaining = Math.ceil(remaining / averagePerDay);
  const forecastDate = new Date(today);
  forecastDate.setDate(forecastDate.getDate() + daysRemaining);

  return {
    isAchievable: true,
    isAlreadyReached: false,
    daysRemaining,
    forecastDate: getLocalDateString(forecastDate),
    averagePerDay,
  };
}

export interface ProfileStats {
  operationsCount: number;
  categoriesCount: number;
  totalSaved: number;
}

export function calculateProfileStats(
  incomes: { category: string }[],
  expenses: { category: string }[],
  goals: { currentAmount: number }[]
): ProfileStats {
  const categories = new Set<string>();
  incomes.forEach((i) => categories.add(i.category));
  expenses.forEach((e) => categories.add(e.category));

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return {
    operationsCount: incomes.length + expenses.length,
    categoriesCount: categories.size,
    totalSaved,
  };
}