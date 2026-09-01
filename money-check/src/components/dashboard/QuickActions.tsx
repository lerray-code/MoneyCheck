import { useState } from "react";
import Modal from "../common/Modal";
import TransactionForm from "../transactions/TransactionForm";
import type { TransactionFormValues } from "../transactions/TransactionForm";
import GoalForm from "../goals/GoalForm";
import type { GoalFormValues } from "../goals/GoalForm";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../types/category";
import { createIncome } from "../../api/incomeApi";
import { createExpense } from "../../api/expenseApi";
import { createGoal } from "../../api/goalApi";
import type { IncomeCategory, ExpenseCategory } from "../../types/category";
import { useAuth } from "../../context/useAuth";
import toast from "react-hot-toast";

type ActiveModal = "income" | "expense" | "goal" | null;

interface QuickActionsProps {
  onDataChanged: () => void;
}



function QuickActions({ onDataChanged }: QuickActionsProps) {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleAddIncome(values: TransactionFormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      await createIncome({
        ...values,
        comment: values.comment ?? "",
        category: values.category as IncomeCategory,
        userId: user.dummyJsonId,
      });
      setActiveModal(null);
      onDataChanged();
      toast.success("Доход добавлен");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddExpense(values: TransactionFormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      await createExpense({
        ...values,
        comment: values.comment ?? "",
        category: values.category as ExpenseCategory,
        userId: user.dummyJsonId,
      });
      setActiveModal(null);
      onDataChanged();
      toast.success("Расход добавлен");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddGoal(values: GoalFormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      await createGoal({
        ...values,
        currentAmount: 0,
        userId: user.dummyJsonId,
      });
      setActiveModal(null);
      onDataChanged();
      toast.success("Цель добавлена");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveModal("income")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Добавить доход
        </button>
        <button
          onClick={() => setActiveModal("expense")}
          className="btn btn-danger"
        >
          + Добавить расход
        </button>
        <button
          onClick={() => setActiveModal("goal")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          + Добавить цель
        </button>
      
      </div>

      <Modal
        isOpen={activeModal === "income"}
        onClose={() => setActiveModal(null)}
        title="Добавить доход"
      >
        <TransactionForm
          categories={INCOME_CATEGORIES}
          onSubmit={handleAddIncome}
          onCancel={() => setActiveModal(null)}
          submitting={submitting}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "expense"}
        onClose={() => setActiveModal(null)}
        title="Добавить расход"
      >
        <TransactionForm
          categories={EXPENSE_CATEGORIES}
          onSubmit={handleAddExpense}
          onCancel={() => setActiveModal(null)}
          submitting={submitting}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "goal"}
        onClose={() => setActiveModal(null)}
        title="Добавить цель"
      >
        <GoalForm
          onSubmit={handleAddGoal}
          onCancel={() => setActiveModal(null)}
          submitting={submitting}
        />
      </Modal>
    </>
  );
}

export default QuickActions;
