import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const goalSchema = z.object({
  title: z.string().min(1, "Введите название цели"),
  targetAmount: z.coerce.number().positive("Сумма должна быть больше 0"),
  currentAmount: z.coerce
    .number()
    .min(0, "Не может быть отрицательной")
    .optional(),
  deadline: z.string().min(1, "Укажите дату"),
});

export type GoalFormValues = z.output<typeof goalSchema>;
type GoalFormInput = z.input<typeof goalSchema>;

interface GoalFormProps {
  defaultValues?: Partial<GoalFormValues>;
  isEditing?: boolean;
  onSubmit: (values: GoalFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function GoalForm({
  defaultValues,
  isEditing,
  onSubmit,
  onCancel,
  submitting,
}: GoalFormProps) {
  const form = useForm<GoalFormInput, unknown, GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      targetAmount: defaultValues?.targetAmount ?? undefined,
      currentAmount: defaultValues?.currentAmount ?? 0,
      deadline: defaultValues?.deadline ?? "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <label className="block text-sm mb-1">Название цели</label>
        <input
          type="text"
          {...register("title")}
          className="border w-full p-2 rounded"
          placeholder="Например, Отпуск"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Сумма цели</label>
        <input
          type="number"
          step="0.01"
          {...register("targetAmount")}
          className="border w-full p-2 rounded"
        />
        {errors.targetAmount && (
          <p className="text-red-500 text-xs mt-1">
            {errors.targetAmount.message}
          </p>
        )}
      </div>

      {!isEditing && (
        <div>
          <label className="block text-sm mb-1">
            Стартовая сумма (если уже что-то накоплено)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("currentAmount")}
            className="border w-full p-2 rounded"
          />
          {errors.currentAmount && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentAmount.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm mb-1">Дедлайн</label>
        <input
          type="date"
          {...register("deadline")}
          className="border w-full p-2 rounded"
        />
        {errors.deadline && (
          <p className="text-red-500 text-xs mt-1">
            {errors.deadline.message}
          </p>
        )}
      </div>

      <div className="flex gap-2 justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border hover:bg-gray-100"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {submitting ? "Сохраняем..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}

export default GoalForm;