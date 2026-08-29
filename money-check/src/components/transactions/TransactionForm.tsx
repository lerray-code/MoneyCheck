import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const transactionSchema = z.object({
  amount: z.coerce.number().positive("Сумма должна быть больше 0"),
  category: z.string().min(1, "Выберите категорию"),
  date: z.string().min(1, "Укажите дату"),
  comment: z.string().max(200, "Слишком длинный комментарий").optional(),
});

export type TransactionFormValues = z.output<typeof transactionSchema>;
type TransactionFormInput = z.input<typeof transactionSchema>;

interface TransactionFormProps {
  categories: readonly string[];
  defaultValues?: Partial<TransactionFormValues>;
  onSubmit: (values: TransactionFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function TransactionForm({
  categories,
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
}: TransactionFormProps) {
  const form = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: defaultValues?.amount ?? undefined,
      category: defaultValues?.category ?? categories[0],
      date: defaultValues?.date ?? new Date().toISOString().slice(0, 10),
      comment: defaultValues?.comment ?? "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

return (
  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
    <div>
      <label className="block text-sm mb-1">Сумма</label>
      <input
        type="number"
        step="0.01"
        {...register("amount")}
        className="border w-full p-2 rounded"
      />
      {errors.amount && (
        <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
      )}
    </div>

    <div>
      <label className="block text-sm mb-1">Категория</label>
      <select
        {...register("category")}
        className="border w-full p-2 rounded"
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
      <label className="block text-sm mb-1">Дата</label>
      <input
        type="date"
        {...register("date")}
        className="border w-full p-2 rounded"
      />
      {errors.date && (
        <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
      )}
    </div>

    <div>
      <label className="block text-sm mb-1">Комментарий</label>
      <input
        type="text"
        {...register("comment")}
        className="border w-full p-2 rounded"
        placeholder="Необязательно"
      />
      {errors.comment && (
        <p className="text-red-500 text-xs mt-1">
          {errors.comment.message}
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
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Сохраняем..." : "Сохранить"}
      </button>
    </div>
  </form>
);
}

export default TransactionForm;