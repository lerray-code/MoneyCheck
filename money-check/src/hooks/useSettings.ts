import { useEffect, useState } from "react";
import type { CurrencyCode } from "../types/currency";

export type Theme = "light" | "dark";

const THEME_KEY = "app_theme";
const CURRENCY_KEY = "app_display_currency";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return "light";
}

function getInitialCurrency(): CurrencyCode {
  const saved = localStorage.getItem(CURRENCY_KEY);
  return (saved as CurrencyCode) || "USD";
}

export function useSettings() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [displayCurrency, setDisplayCurrencyState] = useState<CurrencyCode>(
    getInitialCurrency
  );

  // Применяем класс .dark к html при каждом изменении темы
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, displayCurrency);
  }, [displayCurrency]);

  function toggleTheme() {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }

  function setDisplayCurrency(currency: CurrencyCode) {
    setDisplayCurrencyState(currency);
  }

  return {
    theme,
    toggleTheme,
    displayCurrency,
    setDisplayCurrency,
  };
}