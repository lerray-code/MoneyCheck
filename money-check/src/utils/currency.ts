export function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getYesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export interface RateChange {
  currentRate: number;
  previousRate: number | null;
  changePercent: number | null;
  changeAbsolute: number | null;
}

export function calculateRateChange(
  currentRate: number,
  previousRate: number | null
): RateChange {
  if (previousRate === null || previousRate === 0) {
    return {
      currentRate,
      previousRate: null,
      changePercent: null,
      changeAbsolute: null,
    };
  }

  const changeAbsolute = currentRate - previousRate;
  const changePercent = (changeAbsolute / previousRate) * 100;

  return {
    currentRate,
    previousRate,
    changePercent,
    changeAbsolute,
  };
}