export type AnalyticsPeriod = "week" | "month" | "quarter" | "year" | "all";

export const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  week: "Неделя",
  month: "Месяц",
  quarter: "Квартал",
  year: "Год",
  all: "Всё время",
};