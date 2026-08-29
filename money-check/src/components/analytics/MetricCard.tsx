interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="surface rounded-lg shadow p-5">
      <p className="text-sm text-secondary mb-1">{title}</p>
      <p className="text-xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
    </div>
  );
}

export default MetricCard;