import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../../api/incomeApi";
import type { Income } from "../../types/income";
import { INCOME_CATEGORIES } from "../../types/category";
import type { IncomeCategory } from "../../types/category";
import { useFilteredTransactions } from "../../hooks/useFilteredTransactions";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import TransactionForm from "../../components/transactions/TransactionForm";
import type { TransactionFormValues } from "../../components/transactions/TransactionForm";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionTable from "../../components/transactions/TransactionTable";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";

function Incomes() {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
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
  } = useFilteredTransactions(incomes);

    useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadIncomes() {
        setLoading(true);
        const data = await getIncomes(user!.dummyJsonId);
        if (!cancelled) {
        setIncomes(data);
        setLoading(false);
        }
    }

    loadIncomes();

    return () => {
        cancelled = true;
    };
    }, [user]);

    function openAddForm() {
        setEditingIncome(null);
        setIsFormOpen(true);
  }

  function openEditForm(income: Income) {
    setEditingIncome(income);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(values: TransactionFormValues) {
  if (!user) return;
  setSubmitting(true);
  try {
    if (editingIncome) {
      const updated = await updateIncome(editingIncome.id, {
        ...values,
        category: values.category as IncomeCategory,
      });
      setIncomes((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );
    } else {
      const created = await createIncome({
        ...values,
        comment: values.comment ?? "",
        category: values.category as IncomeCategory,
        userId: user.dummyJsonId,
      });
      setIncomes((prev) => [...prev, created]);
    }
    setIsFormOpen(false);
  } finally {
    setSubmitting(false);
  }
}

  async function handleConfirmDelete() {
    if (!deletingId) return;
    await deleteIncome(deletingId);
    setIncomes((prev) => prev.filter((i) => i.id !== deletingId));
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Доходы</h1>
        <button
          onClick={openAddForm}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Добавить доход
        </button>
      </div>

      <TransactionFilters
        categories={INCOME_CATEGORIES}
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
  <LoadingState message="Загружаем доходы..." />
) : incomes.length === 0 ? (
  <EmptyState
    icon="💰"
    title="Пока нет записей о доходах"
    description="Создайте первый, чтобы отслеживать доходы по категориям"
    action={
      <button
        onClick={openAddForm}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Добавить доход
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
        title={editingIncome ? "Изменить доход" : "Добавить доход"}
      >
        <TransactionForm
          categories={INCOME_CATEGORIES}
          defaultValues={editingIncome ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        message="Удалить эту запись о доходе?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

export default Incomes;