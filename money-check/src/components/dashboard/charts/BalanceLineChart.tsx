import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface BalanceLineChartProps {
  data: { date: string; balance: number }[];
}

function BalanceLineChart({ data }: BalanceLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={11} interval={4} />
        <YAxis fontSize={12} />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString("ru-RU")}`, "Баланс"]}
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default BalanceLineChart;