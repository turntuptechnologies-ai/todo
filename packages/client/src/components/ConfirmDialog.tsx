import { useEffect, useRef } from 'react';

type Props = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const handleCancel = () => {
    dialogRef.current?.close();
    onCancel();
  };

  const handleConfirm = () => {
    dialogRef.current?.close();
    onConfirm();
  };

  return (
    <dialog ref={dialogRef} className="confirm-dialog" onCancel={handleCancel}>
      <p className="confirm-dialog__message">{message}</p>
      <div className="confirm-dialog__actions">
        <button
          type="button"
          className="confirm-dialog__button confirm-dialog__button--cancel"
          onClick={handleCancel}
        >
          キャンセル
        </button>
        <button
          type="button"
          className="confirm-dialog__button confirm-dialog__button--confirm"
          onClick={handleConfirm}
        >
          確認
        </button>
      </div>
    </dialog>
  );
}
