import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useSettingsContext } from "../../context/useSettingsContext";
import { clearAllUserData } from "../../api/clearDataApi";
import { SUPPORTED_CURRENCIES } from "../../types/currency";
import ClearDataDialog from "../../components/settings/ClearDataDialog";

function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme, displayCurrency, setDisplayCurrency } =
    useSettingsContext();

  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cleared, setCleared] = useState(false);

  async function handleClearData() {
    if (!user) return;
    setIsDeleting(true);
    try {
      await clearAllUserData(user.dummyJsonId);
      setIsClearDialogOpen(false);
      setCleared(true);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Настройки</h1>

      {cleared && (
        <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">
          Все данные успешно удалены. Перейдите на другие страницы, чтобы
          увидеть пустые списки.
        </div>
      )}

      <div className="surface dark:bg-gray-900 rounded-lg shadow p-5 mb-4">
        <h2 className="font-semibold mb-3">Оформление</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Тема интерфейса
          </span>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded border hover:surface-alt dark:hover:bg-gray-800 dark:border-gray-700"
          >
            {theme === "light" ? "☀️ Светлая" : "🌙 Тёмная"}
          </button>
        </div>
      </div>

      <div className="surface dark:bg-gray-900 rounded-lg shadow p-5 mb-4">
        <h2 className="font-semibold mb-3">Валюта отображения</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Используется как базовая валюта в конвертере
          </span>
          <select
            value={displayCurrency}
            onChange={(e) =>
              setDisplayCurrency(e.target.value as typeof displayCurrency)
            }
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
          >
            {SUPPORTED_CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="surface dark:bg-gray-900 rounded-lg shadow p-5">
        <h2 className="font-semibold mb-3 text-red-600">Опасная зона</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Удалить все доходы, расходы, бюджеты и цели
          </span>
          <button
            onClick={() => setIsClearDialogOpen(true)}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Очистить данные
          </button>
        </div>
      </div>

      <ClearDataDialog
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={handleClearData}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default Settings;