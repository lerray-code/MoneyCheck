import { useCurrencyRates } from "../../hooks/useCurrencyRates";
import { useSettingsContext } from "../../context/useSettingsContext";
import RatesTable from "../../components/currency/RatesTable";
import CurrencyConverter from "../../components/currency/CurrencyConverter";

function Currency() {
  const {
    loading,
    error,
    baseCurrency,
    currencies,
    getRate,
    getPreviousRate,
    convert,
  } = useCurrencyRates();
  const { displayCurrency } = useSettingsContext();

  if (loading) {
    return <p className="text-muted">Загрузка курсов валют...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        {error}. Проверь, что ключ VITE_EXCHANGE_API_KEY указан верно в файле
        .env, и что json-server запущен.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Курсы валют</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold mb-2">
            Текущие курсы (база: {baseCurrency})
          </h2>
          <RatesTable
            currencies={currencies}
            baseCurrency={baseCurrency}
            getRate={getRate}
            getPreviousRate={getPreviousRate}
          />
        </div>

        <CurrencyConverter
          currencies={currencies}
          convert={convert}
          defaultFrom={displayCurrency}
        />
      </div>
    </div>
  );
}

export default Currency;