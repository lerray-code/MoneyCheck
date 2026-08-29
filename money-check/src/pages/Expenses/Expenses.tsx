import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../../api/expenseApi";
import type { Expense } from "../../types/expense";
import { EXPENSE_CATEGORIES } from "../../types/category";
import type { ExpenseCategory } from "../../types/category";
import { useFilteredTransactions } from "../../hooks/useFilteredTransactions";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import TransactionForm from "../../components/transactions/TransactionForm";
import type { TransactionFormValues } from "../../components/transactions/TransactionForm";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionTable from "../../components/transactions/TransactionTable";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";

function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    filtered,
    filters,
    updateFilter,
    resetFilters,
    sortField,
    sortDirection,
    toggleSort,
  } = useFilteredTransactions(expenses);

useEffect(() => {
  if (!user) return;

  let cancelled = false;

  async function loadExpenses() {
        setLoading(true);
        const data = await getExpenses(user!.dummyJsonId);
        if (!cancelled) {
        setExpenses(data);
        setLoading(false);
        }
    }

    loadExpenses();

    return () => {
        cancelled = true;
    };
    }, [user]);

  function openAddForm() {
    setEditingExpense(null);
    setIsFormOpen(true);
  }

  function openEditForm(expense: Expense) {
    setEditingExpense(expense);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(values: TransactionFormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      if (editingExpense) {
        const updated = await updateExpense(editingExpense.id,  {
                ...values,
                category: values.category as ExpenseCategory,
              });
        setExpenses((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        );
      } else {
        const created = await createExpense({
            ...values,
            comment: values.comment ?? "",
            category: values.category as ExpenseCategory,
            userId: user.dummyJsonId,
        });
        setExpenses((prev) => [...prev, created]);
      }
      setIsFormOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;
    await deleteExpense(deletingId);
    setExpenses((prev) => prev.filter((e) => e.id !== deletingId));
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Расходы</h1>
        <button
          onClick={openAddForm}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          + Добавить расход
        </button>
      </div>

      <TransactionFilters
        categories={EXPENSE_CATEGORIES}
        search={filters.search}
        category={filters.category}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        amountMin={filters.amountMin}
        amountMax={filters.amountMax}
        onSearchChange={(v) => updateFilter("search", v)}
        onCategoryChange={(v) => updateFilter("category", v)}
        onDateFromChange={(v) => updateFilter("dateFrom", v)}
        onDateToChange={(v) => updateFilter("dateTo", v)}
        onAmountMinChange={(v) => updateFilter("amountMin", v)}
        onAmountMaxChange={(v) => updateFilter("amountMax", v)}
        onReset={resetFilters}
      />

      {loading ? (
  <LoadingState message="Загружаем расходы..." />
) : expenses.length === 0 ? (
  <EmptyState
    icon="💰"
    title="Пока нет записей о расходах"
    description="Создайте первый, чтобы отслеживать расходы по категориям"
    action={
      <button
        onClick={openAddForm}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Добавить расход
      </button>
    }
  />
) : (
        <TransactionTable
          transactions={filtered}
          sortField={sortField}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
          onEdit={openEditForm}
          onDelete={setDeletingId}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingExpense ? "Изменить расход" : "Добавить расход"}
      >
        <TransactionForm
          categories={EXPENSE_CATEGORIES}
          defaultValues={editingExpense ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        message="Удалить эту запись о расходе?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

export default Expenses;