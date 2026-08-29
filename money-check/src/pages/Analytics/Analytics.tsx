import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useAnalytics } from "../../hooks/useAnalytics";
import type { AnalyticsPeriod } from "../../types/analytics";
import PeriodSelector from "../../components/analytics/PeriodSelector";
import MetricCard from "../../components/analytics/MetricCard";
import TopCategoriesList from "../../components/analytics/TopCategoriesList";
import AllTransactionsTable from "../../components/analytics/AllTransactionsTable";
import ExpensesByCategoryPie from "../../components/dashboard/charts/ExpensesByCategoryPie";
import ExpensesByWeekBar from "../../components/analytics/charts/ExpensesByWeekBar";
import IncomeByMonthBar from "../../components/dashboard/charts/IncomeByMonthBar";
import YearlyBalanceLine from "../../components/analytics/charts/YearlyBalanceLine"
import LoadingState from "../../components/common/LoadingState";

function Analytics() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<AnalyticsPeriod>("month");

  const {
    loading,
    allTransactions,
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
  } = useAnalytics(user?.dummyJsonId, period);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Аналитика</h1>

      <PeriodSelector value={period} onChange={setPeriod} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Средний чек"
          value={`${averageCheck.toLocaleString("ru-RU", {
            maximumFractionDigits: 0,
          })}`}
        />
        <MetricCard
          title="Самая большая покупка"
          value={
            largestPurchase
              ? `${largestPurchase.amount.toLocaleString("ru-RU")}`
              : "-"
          }
          subtitle={largestPurchase?.category}
        />
        <MetricCard
          title="Количество операций"
          value={String(operationsCount)}
        />
        <MetricCard
          title="Доходы / Расходы"
          value={`${totalIncomes.toLocaleString("ru-RU")} / ${totalExpenses.toLocaleString(
            "ru-RU"
          )}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="surface rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Расходы по категориям</h2>
          <ExpensesByCategoryPie data={expensesByCategory} />
        </div>
        <TopCategoriesList categories={topCategories} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="surface rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Расходы по неделям</h2>
          <ExpensesByWeekBar data={expensesByWeek} />
        </div>
        <div className="surface rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Доходы - динамика</h2>
          <IncomeByMonthBar data={incomeDynamics} />
        </div>
      </div>

      <div className="surface rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold mb-2">Баланс - изменение за год</h2>
        <YearlyBalanceLine data={yearlyBalance} />
      </div>

      <h2 className="font-semibold mb-2">Все транзакции</h2>
      <AllTransactionsTable transactions={allTransactions} />
    </div>
  );
}

export default Analytics;