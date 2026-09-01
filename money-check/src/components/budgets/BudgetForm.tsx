import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


const budgetSchema = z.object({
  category: z.string().min(1, "Выберите категорию"),
  limit: z.coerce.number().positive("Лимит должен быть больше 0"),
  period: z.enum(["week", "month", "year"]),
});

export type BudgetFormValues = z.output<typeof budgetSchema>;
type BudgetFormInput = z.input<typeof budgetSchema>;

interface BudgetFormProps {
  categories: readonly string[];
  defaultValues?: Partial<BudgetFormValues>;
  onSubmit: (values: BudgetFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

const PERIOD_LABELS: Record<string, string> = {
  week: "Неделя",
  month: "Месяц",
  year: "Год",
};

function BudgetForm({
  categories,
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
}: BudgetFormProps) {
  
  const form = useForm<BudgetFormInput, unknown, BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: defaultValues?.category ?? categories[0],
      limit: defaultValues?.limit ?? undefined,
      period: defaultValues?.period ?? "month",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  return (
    <form
    onSubmit={(e) => {
      console.log("Форма сабмитится, preventDefault вызовется сейчас");
      return handleSubmit(onSubmit)(e);
    }}
    className="flex flex-col gap-3">
      <div>
        <label className="block text-sm mb-1">Категория</label>
        <select
          {...register("category")}
          className="input"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Лимит суммы</label>
        <input
          type="number"
          step="0.01"
          {...register("limit")}
          className="input"
        />
        {errors.limit && (
          <p className="text-red-500 text-xs mt-1">{errors.limit.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Период</label>
        <select {...register("period")} className="input">
          {Object.entries(PERIOD_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.period && (
          <p className="text-red-500 text-xs mt-1">{errors.period.message}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Сохраняем..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}

export default BudgetForm;