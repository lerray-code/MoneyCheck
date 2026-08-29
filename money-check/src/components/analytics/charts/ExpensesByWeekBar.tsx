import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ExpensesByWeekBarProps {
  data: { week: string; total: number }[];
}

function ExpensesByWeekBar({ data }: ExpensesByWeekBarProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" fontSize={11} />
        <YAxis fontSize={12} />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString("ru-RU")}`, "Баланс"]}
        />
        <Bar dataKey="total" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ExpensesByWeekBar;