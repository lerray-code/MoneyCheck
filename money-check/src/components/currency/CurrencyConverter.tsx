import { useState } from "react";
import type { CurrencyCode } from "../../types/currency";


interface CurrencyConverterProps {
  currencies: readonly CurrencyCode[];
  convert: (
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode
  ) => number | null;
  defaultFrom?: CurrencyCode;
}

function CurrencyConverter({
  currencies,
  convert,
  defaultFrom,
}: CurrencyConverterProps) {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<CurrencyCode>(defaultFrom ?? currencies[0]);
  const [to, setTo] = useState<CurrencyCode>(currencies[1] ?? currencies[0]);

  const numericAmount = Number(amount) || 0;
  const result = convert(numericAmount, from, to);

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="surface rounded-lg shadow p-5">
      <h3 className="font-semibold mb-3">Конвертер валют</h3>

      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs text-secondary mb-1">Сумма</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="block text-xs text-secondary mb-1">Из</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value as CurrencyCode)}
            className="border p-2 rounded"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSwap}
          type="button"
          className="p-2 border rounded hover:bg-gray-100"
          title="Поменять местами"
        >
          ⇄
        </button>

        <div>
          <label className="block text-xs text-secondary mb-1">В</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value as CurrencyCode)}
            className="border p-2 rounded"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 p-4 surface-alt rounded text-center">
        {result !== null ? (
          <p className="text-2xl font-bold">
            {numericAmount.toLocaleString("ru-RU")} {from} ={" "}
            {result.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} {to}
          </p>
        ) : (
          <p className="text-muted">Не удалось рассчитать конвертацию</p>
        )}
      </div>
    </div>
  );
}

export default CurrencyConverter;