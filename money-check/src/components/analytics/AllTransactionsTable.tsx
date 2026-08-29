import type { Transaction } from "../../types/transaction";
import { INCOME_CATEGORIES } from "../../types/category";

interface AllTransactionsTableProps {
  transactions: Transaction[];
}

function AllTransactionsTable({ transactions }: AllTransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="surface rounded-lg shadow p-8 text-center text-muted">
        Нет операций за выбранный период
      </div>
    );
  }

  return (
    <div className="surface rounded-lg shadow overflow-x-auto max-h-96 overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 surface-alt">
          <tr className="border-b text-left">
            <th className="p-3">Дата</th>
            <th className="p-3">Тип</th>
            <th className="p-3">Категория</th>
            <th className="p-3">Сумма</th>
            <th className="p-3">Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const isIncome = (INCOME_CATEGORIES as readonly string[]).includes(
              t.category
            );
            return (
              <tr key={t.id} className="border-b hover:surface-alt">
                <td className="p-3">{t.date}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      isIncome
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isIncome ? "Доход" : "Расход"}
                  </span>
                </td>
                <td className="p-3">{t.category}</td>
                <td
                  className={`p-3 font-medium ${
                    isIncome ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {t.amount.toLocaleString("ru-RU")}
                </td>
                <td className="p-3 text-secondary">{t.comment || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AllTransactionsTable;