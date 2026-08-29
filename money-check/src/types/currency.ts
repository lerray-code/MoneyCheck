export interface ExchangeRateRecord {
  id: string;
  date: string; 
  base: string;
  rates: Record<string, number>;
}

export type CreateExchangeRateRecordDto = Omit<ExchangeRateRecord, "id">;

// Ответ от ExchangeRate API
export interface ExchangeRateApiResponse {
  result: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

export const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "RUB",
  "BYN",
  "GBP",
  "CNY",
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];