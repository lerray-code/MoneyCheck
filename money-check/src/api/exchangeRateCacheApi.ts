import { api } from "./axiosInstance";
import type {
  ExchangeRateRecord,
  CreateExchangeRateRecordDto,
} from "../types/currency";

export async function findRateRecord(
  base: string,
  date: string
): Promise<ExchangeRateRecord | null> {
  const response = await api.get<ExchangeRateRecord[]>(
    `/exchangeRates?base=${base}&date=${date}`
  );
  return response.data[0] || null;
}

export async function saveRateRecord(
  dto: CreateExchangeRateRecordDto
): Promise<ExchangeRateRecord> {
  const response = await api.post<ExchangeRateRecord>(
    "/exchangeRates",
    dto
  );
  return response.data;
}