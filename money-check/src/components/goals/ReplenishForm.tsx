import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const replenishSchema = z.object({
  amount: z.coerce.number().positive("Сумма должна быть больше 0"),
  date: z.string().min(1, "Укажите дату"),
});

export type ReplenishFormValues = z.output<typeof replenishSchema>;
type ReplenishFormInput = z.input<typeof replenishSchema>;

interface ReplenishFormProps {
  onSubmit: (values: ReplenishFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function ReplenishForm({ onSubmit, onCancel, submitting }: ReplenishFormProps) {
  const form = useForm<ReplenishFormInput, unknown, ReplenishFormValues>({
    resolver: zodResolver(replenishSchema),
    defaultValues: {
      amount: undefined,
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <label className="block text-sm mb-1">Сумма пополнения</label>
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
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Сохраняем..." : "Пополнить"}
        </button>
      </div>
    </form>
  );
}

export default ReplenishForm;