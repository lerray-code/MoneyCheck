interface StatWidgetProps {
  title: string;
  value: number;
  suffix?: string;
  colorClass?: string;
}

function StatWidget({
  title,
  value,
  suffix = "Денег",
  colorClass = "text-primary",
}: StatWidgetProps) {
  return (
    <div className="card card-hover p-5">
      <p className="text-xs font-medium text-secondary uppercase tracking-wide mb-2">
        {title}
      </p>
      <p className={`text-2xl font-bold ${colorClass}`}>
        {value.toLocaleString("ru-RU")}{" "}
        <span className="text-base font-medium text-muted">{suffix}</span>
      </p>
    </div>
  );
}

export default StatWidget;