import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { getIncomes } from "../../api/incomeApi";
import { getExpenses } from "../../api/expenseApi";
import { getGoals } from "../../api/goalApi";
import { calculateProfileStats } from "../../utils/calculations";
import type { ProfileStats } from "../../utils/calculations";

function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadStats() {
      setLoading(true);
      const [incomes, expenses, goals] = await Promise.all([
        getIncomes(user!.dummyJsonId),
        getExpenses(user!.dummyJsonId),
        getGoals(user!.dummyJsonId),
      ]);
      if (!cancelled) {
        setStats(calculateProfileStats(incomes, expenses, goals));
        setLoading(false);
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>

      <div className="surface dark:bg-gray-900 rounded-lg shadow p-6 mb-6 flex items-center gap-4">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-secondary">{user.email}</p>
          <p className="text-muted text-sm">@{user.username}</p>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Статистика</h2>
      {loading || !stats ? (
        <p className="text-muted">Загрузка...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="surface dark:bg-gray-900 rounded-lg shadow p-5">
            <p className="text-sm text-secondary mb-1">Операций совершено</p>
            <p className="text-2xl font-bold">{stats.operationsCount}</p>
          </div>
          <div className="surface dark:bg-gray-900 rounded-lg shadow p-5">
            <p className="text-sm text-secondary mb-1">
              Использовано категорий
            </p>
            <p className="text-2xl font-bold">{stats.categoriesCount}</p>
          </div>
          <div className="surface dark:bg-gray-900 rounded-lg shadow p-5">
            <p className="text-sm text-secondary mb-1">
              Накоплено по целям
            </p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.totalSaved.toLocaleString("ru-RU")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;