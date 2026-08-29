import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface IncomeByMonthBarProps {
  data: { month: string; total: number }[];
}

function IncomeByMonthBar({ data }: IncomeByMonthBarProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString("ru-RU")}`, "Баланс"]}
        />
        <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default IncomeByMonthBar;