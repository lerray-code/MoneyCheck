import { useEffect, useState } from "react";
import { fetchLatestRates } from "../api/currencyApi";
import { findRateRecord, saveRateRecord } from "../api/exchangeRateCacheApi";
import { getTodayDate, getYesterdayDate } from "../utils/currency";
import type { CurrencyCode } from "../types/currency";
import { SUPPORTED_CURRENCIES } from "../types/currency";

const BASE_CURRENCY = "USD";

export function useCurrencyRates() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [previousRates, setPreviousRates] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRates() {
      setLoading(true);
      setError(null);
      try {
        const today = getTodayDate();
        const yesterday = getYesterdayDate();

        // 1. Проверяем, есть ли уже кэш на сегодня
        let todayRecord = await findRateRecord(BASE_CURRENCY, today);

        // 2. Если нет - запрашиваем у API и сохраняем
        if (!todayRecord) {
          const apiResponse = await fetchLatestRates(BASE_CURRENCY);
          todayRecord = await saveRateRecord({
            date: today,
            base: BASE_CURRENCY,
            rates: apiResponse.conversion_rates,
          });
        }

        // 3. Смотрим, есть ли кэш за вчера - для расчёта изменения
        const yesterdayRecord = await findRateRecord(BASE_CURRENCY, yesterday);

        if (!cancelled) {
          setRates(todayRecord.rates);
          setPreviousRates(yesterdayRecord?.rates ?? {});
        }
      } catch {
        if (!cancelled) {
          setError("Не удалось загрузить курсы валют");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRates();

    return () => {
      cancelled = true;
    };
  }, []);

  function getRate(currency: CurrencyCode): number | null {
    return rates[currency] ?? null;
  }

  function getPreviousRate(currency: CurrencyCode): number | null {
    return previousRates[currency] ?? null;
  }

  function convert(
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode
  ): number | null {
    if (from === BASE_CURRENCY) {
      const rate = getRate(to);
      return rate ? amount * rate : null;
    }
    if (to === BASE_CURRENCY) {
      const rate = getRate(from);
      return rate ? amount / rate : null;
    }
    // Конвертация между двумя не-базовыми валютами через базовую USD
    const fromRate = getRate(from);
    const toRate = getRate(to);
    if (!fromRate || !toRate) return null;
    return (amount / fromRate) * toRate;
  }

  return {
    loading,
    error,
    baseCurrency: BASE_CURRENCY,
    currencies: SUPPORTED_CURRENCIES,
    getRate,
    getPreviousRate,
    convert,
  };
}