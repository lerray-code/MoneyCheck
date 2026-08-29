import axios from "axios";
import type { ExchangeRateApiResponse } from "../types/currency";

const EXCHANGE_API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;
const EXCHANGE_API_URL = "https://v6.exchangerate-api.com/v6";

export async function fetchLatestRates(
  baseCurrency: string
): Promise<ExchangeRateApiResponse> {
  const response = await axios.get<ExchangeRateApiResponse>(
    `${EXCHANGE_API_URL}/${EXCHANGE_API_KEY}/latest/${baseCurrency}`
  );
  return response.data;
}