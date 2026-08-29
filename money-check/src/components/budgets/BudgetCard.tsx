import type { Budget } from "../../types/budget";

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onEdit: () => void;
  onDelete: () => void;
}

const PERIOD_LABELS: Record<string, string> = {
  week: "в неделю",
  month: "в месяц",
  year: "в год",
};

function BudgetCard({ budget, spent, onEdit, onDelete }: BudgetCardProps) {
  const percent = Math.min(Math.round((spent / budget.limit) * 100), 100);
  const isOverBudget = spent > budget.limit;

  let barColor = "bg-green-500";
  if (percent >= 90) barColor = "bg-red-500";
  else if (percent >= 70) barColor = "bg-yellow-500";

  return (
    <div className="surface rounded-lg shadow p-5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{budget.category}</h3>
          <p className="text-xs text-muted">
            {PERIOD_LABELS[budget.period]}
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
          className={`h-3 rounded-full ${barColor} transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className={isOverBudget ? "text-red-600 font-medium" : "text-gray-700"}>
          {spent.toLocaleString("ru-RU")}
        </span>
        <span className="text-muted">
          из {budget.limit.toLocaleString("ru-RU")}
        </span>
      </div>

      {isOverBudget && (
        <p className="text-xs text-red-600 mt-1">
          Превышение на {(spent - budget.limit).toLocaleString("ru-RU")}
        </p>
      )}
    </div>
  );
}

export default BudgetCard;