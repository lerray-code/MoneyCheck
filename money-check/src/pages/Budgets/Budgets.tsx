import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../../api/budgetApi";
import { getExpenses } from "../../api/expenseApi";
import type { Budget } from "../../types/budget";
import type { Expense } from "../../types/expense";
import { EXPENSE_CATEGORIES } from "../../types/category";
import { calculateSpentForBudget } from "../../utils/calculations";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import BudgetForm from "../../components/budgets/BudgetForm";
import type { BudgetFormValues } from "../../components/budgets/BudgetForm";
import BudgetCard from "../../components/budgets/BudgetCard";
import type { ExpenseCategory } from "../../types/category";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";

function Budgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      const [budgetsData, expensesData] = await Promise.all([
        getBudgets(user!.dummyJsonId),
        getExpenses(user!.dummyJsonId),
      ]);
      if (!cancelled) {
        setBudgets(budgetsData);
        setExpenses(expensesData);
        setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [user]);

  function openAddForm() {
    setEditingBudget(null);
    setIsFormOpen(true);
  }

  function openEditForm(budget: Budget) {
    setEditingBudget(budget);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(values: BudgetFormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        category: values.category as ExpenseCategory,
      };

      if (editingBudget) {
        const updated = await updateBudget(editingBudget.id, payload);
        setBudgets((prev) =>
          prev.map((b) => (b.id === updated.id ? updated : b))
        );
      } else {
        const created = await createBudget({
          ...payload,
          userId: user.dummyJsonId,
        });
        setBudgets((prev) => [...prev, created]);
      }
      setIsFormOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;
    await deleteBudget(deletingId);
    setBudgets((prev) => prev.filter((b) => b.id !== deletingId));
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Бюджеты</h1>
        <button
          onClick={openAddForm}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Создать бюджет
        </button>
      </div>

      {loading ? (
  <LoadingState message="Загружаем бюджеты..." />
) : budgets.length === 0 ? (
  <EmptyState
    icon="💰"
    title="Пока нет ни одного бюджета"
    description="Создайте первый, чтобы отслеживать расходы по категориям"
    action={
      <button
        onClick={openAddForm}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Создать бюджет
      </button>
    }
  />
) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={calculateSpentForBudget(budget, expenses)}
              onEdit={() => openEditForm(budget)}
              onDelete={() => setDeletingId(budget.id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingBudget ? "Изменить бюджет" : "Создать бюджет"}
      >
        <BudgetForm
          categories={EXPENSE_CATEGORIES}
          defaultValues={editingBudget ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        message="Удалить этот бюджет?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}



export default Budgets;