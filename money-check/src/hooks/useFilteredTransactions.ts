import { useMemo, useState } from "react";
import type { Transaction, SortField, SortDirection } from "../types/transaction";

interface Filters {
  search: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
}

const initialFilters: Filters = {
  search: "",
  category: "all",
  dateFrom: "",
  dateTo: "",
  amountMin: "",
  amountMax: "",
};

export function useFilteredTransactions<T extends Transaction>(
  transactions: T[]
) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const result = useMemo(() => {
    let list = [...transactions];

    // Поиск по комментарию и категории
    if (filters.search.trim()) {
      const query = filters.search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.comment.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    // Фильтр по категории
    if (filters.category !== "all") {
      list = list.filter((t) => t.category === filters.category);
    }

    // Фильтр по периоду
    if (filters.dateFrom) {
      list = list.filter((t) => t.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      list = list.filter((t) => t.date <= filters.dateTo);
    }

    // Фильтр по сумме
    if (filters.amountMin) {
      list = list.filter((t) => t.amount >= Number(filters.amountMin));
    }
    if (filters.amountMax) {
      list = list.filter((t) => t.amount <= Number(filters.amountMax));
    }

    // Сортировка
    list.sort((a, b) => {
      let compareResult = 0;
      if (sortField === "date") {
        compareResult = a.date.localeCompare(b.date);
      } else if (sortField === "amount") {
        compareResult = a.amount - b.amount;
      } else if (sortField === "category") {
        compareResult = a.category.localeCompare(b.category);
      }
      return sortDirection === "asc" ? compareResult : -compareResult;
    });

    return list;
  }, [transactions, filters, sortField, sortDirection]);

  return {
    filtered: result,
    filters,
    updateFilter,
    resetFilters,
    sortField,
    sortDirection,
    toggleSort,
  };
}