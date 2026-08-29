interface StatWidgetProps {
  title: string;
  value: number;
  suffix?: string;
  colorClass?: string;
}

function StatWidget({
  title,
  value,
  suffix = "денег",
  colorClass = "--color-text-primary",
}: StatWidgetProps) {
  return (
    <div className="surface rounded-lg shadow p-5">
      <p className="text-sm text-secondary mb-1">{title}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>
        {value.toLocaleString("ru-RU")} {suffix}
      </p>
    </div>
  );
}

export default StatWidget;