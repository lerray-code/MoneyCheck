interface TopCategoriesListProps {
  categories: { name: string; value: number }[];
}

function TopCategoriesList({ categories }: TopCategoriesListProps) {
  if (categories.length === 0) {
    return (
      <div className="surface rounded-lg shadow p-5 text-muted text-sm">
        Нет данных за выбранный период
      </div>
    );
  }

  const maxValue = categories[0]?.value ?? 1;

  return (
    <div className="surface rounded-lg shadow p-5">
      <h3 className="font-semibold mb-3">ТОП категорий расходов</h3>
      <div className="flex flex-col gap-3">
        {categories.map((cat, index) => (
          <div key={cat.name}>
            <div className="flex justify-between text-sm mb-1">
              <span>
                {index + 1}. {cat.name}
              </span>
              <span className="font-medium">
                {cat.value.toLocaleString("ru-RU")}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${(cat.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCategoriesList;