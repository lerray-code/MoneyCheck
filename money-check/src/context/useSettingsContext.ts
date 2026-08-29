import { useContext } from "react";
import { SettingsContext } from "./SettingsContext";

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext должен использоваться внутри SettingsProvider"
    );
  }
  return context;
}