import { createContext } from "react";
import type { Theme } from "../hooks/useSettings";
import type { CurrencyCode } from "../types/currency";

export interface SettingsContextType {
  theme: Theme;
  toggleTheme: () => void;
  displayCurrency: CurrencyCode;
  setDisplayCurrency: (currency: CurrencyCode) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);