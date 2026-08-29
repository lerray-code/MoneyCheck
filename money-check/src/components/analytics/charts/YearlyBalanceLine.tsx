import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface YearlyBalanceLineProps {
  data: { month: string; balance: number }[];
}

function YearlyBalanceLine({ data }: YearlyBalanceLineProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString("ru-RU")}`, "Баланс"]}
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default YearlyBalanceLine;