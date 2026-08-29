import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useGoals } from "../../hooks/useGoals";
import type { Goal } from "../../types/goal";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import GoalForm from "../../components/goals/GoalForm";
import type { GoalFormValues } from "../../components/goals/GoalForm";
import ReplenishForm from "../../components/goals/ReplenishForm";
import type { ReplenishFormValues } from "../../components/goals/ReplenishForm";
import GoalCard from "../../components/goals/GoalCard";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";

function Goals() {
  const { user } = useAuth();
  const {
    goals,
    loading,
    getForecastForGoal,
    addGoal,
    editGoal,
    removeGoal,
    replenishGoal,
  } = useGoals(user?.dummyJsonId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [replenishingGoal, setReplenishingGoal] = useState<Goal | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function openAddForm() {
    setEditingGoal(null);
    setIsFormOpen(true);
  }

  function openEditForm(goal: Goal) {
    setEditingGoal(goal);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(values: GoalFormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      if (editingGoal) {
        await editGoal(editingGoal.id, {
          title: values.title,
          targetAmount: values.targetAmount,
          deadline: values.deadline,
        });
      } else {
        await addGoal({
          title: values.title,
          targetAmount: values.targetAmount,
          currentAmount: values.currentAmount ?? 0,
          deadline: values.deadline,
          userId: user.dummyJsonId,
        });
      }
      setIsFormOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReplenishSubmit(values: ReplenishFormValues) {
    if (!user || !replenishingGoal) return;
    setSubmitting(true);
    try {
      await replenishGoal(
        replenishingGoal,
        user.dummyJsonId,
        values.amount,
        values.date
      );
      setReplenishingGoal(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;
    await removeGoal(deletingId);
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Цели накоплений</h1>
        <button
          onClick={openAddForm}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          + Создать цель
        </button>
      </div>

     {loading ? (
  <LoadingState message="Загружаем цели..." />
) : goals.length === 0 ? (
  <EmptyState
    icon="💰"
    title="Пока нет ни одногй цели =("
    description="Создайте первыю цель"
    action={
      <button
        onClick={openAddForm}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Создать цель
      </button>
    }
  />
) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              forecast={getForecastForGoal(goal)}
              onReplenish={() => setReplenishingGoal(goal)}
              onEdit={() => openEditForm(goal)}
              onDelete={() => setDeletingId(goal.id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingGoal ? "Изменить цель" : "Создать цель"}
      >
        <GoalForm
          defaultValues={editingGoal ?? undefined}
          isEditing={!!editingGoal}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <Modal
        isOpen={!!replenishingGoal}
        onClose={() => setReplenishingGoal(null)}
        title={`Пополнить: ${replenishingGoal?.title ?? ""}`}
      >
        <ReplenishForm
          onSubmit={handleReplenishSubmit}
          onCancel={() => setReplenishingGoal(null)}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        message="Удалить эту цель? Все пополнения тоже будут удалены."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

export default Goals;