import type { Goal } from "../../types/goal";
import type { GoalForecast } from "../../utils/calculations";

interface GoalCardProps {
  goal: Goal;
  forecast: GoalForecast;
  onReplenish: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function GoalCard({
  goal,
  forecast,
  onReplenish,
  onEdit,
  onDelete,
}: GoalCardProps) {
  const percent = Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100
  );

  const deadlinePassed = new Date(goal.deadline) < new Date();

  return (
    <div className="surface rounded-lg shadow p-5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{goal.title}</h3>
          <p className="text-xs text-muted">
            Дедлайн: {formatDate(goal.deadline)}
            {deadlinePassed && !forecast.isAlreadyReached && (
              <span className="text-red-500"> (просрочен)</span>
            )}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button onClick={onEdit} className="text-blue-600 hover:underline">
            Изменить
          </button>
          <button onClick={onDelete} className="text-red-600 hover:underline">
            Удалить
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all ${
            forecast.isAlreadyReached ? "bg-green-500" : "bg-purple-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm mb-3">
        <span className="font-medium">
          {goal.currentAmount.toLocaleString("ru-RU")}
        </span>
        <span className="text-muted">
          из {goal.targetAmount.toLocaleString("ru-RU")} ({percent}%)
        </span>
      </div>

      <div className="surface-alt rounded p-3 text-sm mb-3">
        {forecast.isAlreadyReached ? (
          <p className="text-green-600 font-medium">🎉 Цель достигнута!</p>
        ) : forecast.isAchievable && forecast.forecastDate ? (
          <p>
            При текущем темпе (
            {forecast.averagePerDay.toLocaleString("ru-RU", {
              maximumFractionDigits: 0,
            })}{" "}
             цель будет достигнута примерно{" "}
            <span className="font-medium">
              {formatDate(forecast.forecastDate)}
            </span>{" "}
            (через {forecast.daysRemaining} дн.)
          </p>
        ) : (
          <p className="text-secondary">
            Пополните цель хотя бы раз, чтобы увидеть прогноз
          </p>
        )}
      </div>

      <button
        onClick={onReplenish}
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
      >
        + Пополнить
      </button>
    </div>
  );
}

export default GoalCard;