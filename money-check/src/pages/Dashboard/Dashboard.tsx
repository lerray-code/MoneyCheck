import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useDashboardData } from "../../hooks/useDashboardData";
import StatWidget from "../../components/dashboard/StatWidget";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentTransactionsTable from "../../components/dashboard/RecentTransactionsTable";
import ExpensesByCategoryPie from "../../components/dashboard/charts/ExpensesByCategoryPie";
import IncomeByMonthBar from "../../components/dashboard/charts/IncomeByMonthBar";
import BalanceLineChart from "../../components/dashboard/charts/BalanceLineChart";
import LoadingState from "../../components/common/LoadingState";

function Dashboard() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    loading,
    totalBalance,
    monthIncomeTotal,
    monthExpenseTotal,
    budgetRemaining,
    expensesByCategory,
    incomeByMonth,
    balanceHistory,
    recentTransactions,
    reload,
  } = useDashboardData(user?.dummyJsonId);

  void refreshKey;

  function handleDataChanged() {
    setRefreshKey((prev) => prev + 1);
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Главная</h1>

      <QuickActions onDataChanged={handleDataChanged} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatWidget title="Общий баланс" value={totalBalance} />
        <StatWidget
          title="Доход за месяц"
          value={monthIncomeTotal}
          colorClass="text-green-600"
        />
        <StatWidget
          title="Расход за месяц"
          value={monthExpenseTotal}
          colorClass="text-red-600"
        />
        <StatWidget
          title="Остаток бюджета"
          value={budgetRemaining}
          colorClass={budgetRemaining >= 0 ? "text-blue-600" : "text-red-600"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="surface rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Расходы по категориям</h2>
          <ExpensesByCategoryPie data={expensesByCategory} />
        </div>
        <div className="surface rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Доходы по месяцам</h2>
          <IncomeByMonthBar data={incomeByMonth} />
        </div>
        <div className="surface rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Изменение баланса</h2>
          <BalanceLineChart data={balanceHistory} />
        </div>
      </div>

      <h2 className="font-semibold mb-2">Последние операции</h2>
      <RecentTransactionsTable transactions={recentTransactions} />
    </div>
  );
}

export default Dashboard;
