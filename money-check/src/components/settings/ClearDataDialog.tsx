import { useState } from "react";
import Modal from "../common/Modal";

interface ClearDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const CONFIRM_WORD = "УДАЛИТЬ";

function ClearDataDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: ClearDataDialogProps) {
  const [input, setInput] = useState("");

  function handleClose() {
    setInput("");
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Очистить все данные">
      <p className="text-sm text-gray-600 mb-3">
        Это действие удалит все ваши доходы, расходы, бюджеты и цели
        накоплений безвозвратно. Чтобы подтвердить, введите слово{" "}
        <strong>{CONFIRM_WORD}</strong> в поле ниже.
      </p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="input mb-4"
        placeholder={CONFIRM_WORD}
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleClose}
          className="btn btn-secondary"
        >
          Отмена
        </button>
        <button
          onClick={onConfirm}
          disabled={input !== CONFIRM_WORD || isDeleting}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Удаляем..." : "Удалить всё"}
        </button>
      </div>
    </Modal>
  );
}

export default ClearDataDialog;