import type { Transaction, SortField, SortDirection } from "../../types/transaction";
import EmptyState from "../../components/common/EmptyState";

interface TransactionTableProps<T extends Transaction> {
  transactions: T[];
  sortField: SortField;
  sortDirection: SortDirection;
  onToggleSort: (field: SortField) => void;
  onEdit: (transaction: T) => void;
  onDelete: (id: string) => void;
}

function SortArrow({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active) return <span className="text-gray-300 ml-1">↕</span>;
  return <span className="ml-1">{direction === "asc" ? "↑" : "↓"}</span>;
}

function TransactionTable<T extends Transaction>({
  transactions,
  sortField,
  sortDirection,
  onToggleSort,
  onEdit,
  onDelete,
}: TransactionTableProps<T>) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="Нет записей"
        description="Попробуйте изменить фильтры или добавьте новую запись"
      />
    );
}

  return (
    <div className="surface rounded shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b surface-alt text-left">
            <th
              className="p-3 cursor-pointer select-none"
              onClick={() => onToggleSort("date")}
            >
              Дата
              <SortArrow active={sortField === "date"} direction={sortDirection} />
            </th>
            <th
              className="p-3 cursor-pointer select-none"
              onClick={() => onToggleSort("category")}
            >
              Категория
              <SortArrow
                active={sortField === "category"}
                direction={sortDirection}
              />
            </th>
            <th
              className="p-3 cursor-pointer select-none"
              onClick={() => onToggleSort("amount")}
            >
              Сумма
              <SortArrow
                active={sortField === "amount"}
                direction={sortDirection}
              />
            </th>
            <th className="p-3">Комментарий</th>
            <th className="p-3 text-right">Действия</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b hover:surface-alt">
              <td className="p-3">{t.date}</td>
              <td className="p-3">{t.category}</td>
              <td className="p-3 font-medium">{t.amount.toLocaleString()}</td>
              <td className="p-3 text-secondary">{t.comment || "-"}</td>
              <td className="p-3 text-right">
                <button
                  onClick={() => onEdit(t)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Изменить
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-red-600 hover:underline"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



export default TransactionTable;