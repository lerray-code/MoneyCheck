import type { CurrencyCode } from "../../types/currency";
import { calculateRateChange } from "../../utils/currency";

interface RatesTableProps {
  currencies: readonly CurrencyCode[];
  baseCurrency: string;
  getRate: (currency: CurrencyCode) => number | null;
  getPreviousRate: (currency: CurrencyCode) => number | null;
}

function RatesTable({
  currencies,
  baseCurrency,
  getRate,
  getPreviousRate,
}: RatesTableProps) {
  const displayCurrencies = currencies.filter((c) => c !== baseCurrency);

  return (
    <div className="surface rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b surface-alt text-left">
            <th className="p-3">Валюта</th>
            <th className="p-3">
              Курс к {baseCurrency}
            </th>
            <th className="p-3">Изменение за день</th>
          </tr>
        </thead>
        <tbody>
          {displayCurrencies.map((currency) => {
            const rate = getRate(currency);
            const previousRate = getPreviousRate(currency);
            const change = calculateRateChange(rate ?? 0, previousRate);

            return (
              <tr key={currency} className="border-b hover:surface-alt">
                <td className="p-3 font-medium">{currency}</td>
                <td className="p-3">
                  {rate !== null ? rate.toFixed(4) : "-"}
                </td>
                <td className="p-3">
                  {change.changePercent === null ? (
                    <span className="text-muted">Нет данных за вчера</span>
                  ) : (
                    <span
                      className={
                        change.changePercent >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {change.changePercent >= 0 ? "▲" : "▼"}{" "}
                      {Math.abs(change.changePercent).toFixed(2)}%
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RatesTable;