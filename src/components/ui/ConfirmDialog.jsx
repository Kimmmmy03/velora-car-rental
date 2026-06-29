import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  variant = 'danger',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-gray-400 text-sm leading-relaxed mb-8">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} size="sm">
          Cancel
        </Button>
        <Button variant={variant} onClick={onConfirm} size="sm">
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}
