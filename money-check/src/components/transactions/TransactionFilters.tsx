interface TransactionFiltersProps {
  categories: readonly string[];
  search: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onAmountMinChange: (value: string) => void;
  onAmountMaxChange: (value: string) => void;
  onReset: () => void;
}

function TransactionFilters({
  categories,
  search,
  category,
  dateFrom,
  dateTo,
  amountMin,
  amountMax,
  onSearchChange,
  onCategoryChange,
  onDateFromChange,
  onDateToChange,
  onAmountMinChange,
  onAmountMaxChange,
  onReset,
}: TransactionFiltersProps) {
  return (
    <div className="surface p-4 rounded shadow mb-4 flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs mb-1 text-secondary">Поиск</label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Комментарий, категория..."
          className="border p-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-xs mb-1 text-secondary">Категория</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="all">Все</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs mb-1 text-secondary">Дата с</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="border p-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-xs mb-1 text-secondary">Дата по</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="border p-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-xs mb-1 text-secondary">Сумма от</label>
        <input
          type="number"
          value={amountMin}
          onChange={(e) => onAmountMinChange(e.target.value)}
          className="border p-2 rounded text-sm w-24"
        />
      </div>

      <div>
        <label className="block text-xs mb-1 text-secondary">Сумма до</label>
        <input
          type="number"
          value={amountMax}
          onChange={(e) => onAmountMaxChange(e.target.value)}
          className="border p-2 rounded text-sm w-24"
        />
      </div>

      <button
        onClick={onReset}
        className="text-sm px-3 py-2 rounded border hover:bg-gray-100"
      >
        Сбросить
      </button>
    </div>
  );
}

export default TransactionFilters;