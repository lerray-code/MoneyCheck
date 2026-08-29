import type { AnalyticsPeriod } from "../../types/analytics";
import { PERIOD_LABELS } from "../../types/analytics";

interface PeriodSelectorProps {
  value: AnalyticsPeriod;
  onChange: (value: AnalyticsPeriod) => void;
}

function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const periods = Object.keys(PERIOD_LABELS) as AnalyticsPeriod[];

  return (
    <div className="flex gap-2 mb-6">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={`px-3 py-1.5 rounded text-sm ${
            value === period
              ? "bg-blue-600 text-white"
              : "surface text-gray-600 border hover:surface-alt"
          }`}
        >
          {PERIOD_LABELS[period]}
        </button>
      ))}
    </div>
  );
}

export default PeriodSelector;