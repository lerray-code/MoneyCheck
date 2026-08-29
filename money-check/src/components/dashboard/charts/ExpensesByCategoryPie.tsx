import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ExpensesByCategoryPieProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#6366f1",
];

function ExpensesByCategoryPie({ data }: ExpensesByCategoryPieProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        Нет расходов за этот месяц
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={(entry) => `${entry.name}`}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString("ru-RU")}`, "Баланс"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default ExpensesByCategoryPie;