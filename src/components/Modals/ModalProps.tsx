export type ModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  onOpen?: () => void;
  onConfirm: () => void;
  onCloseAction?: () => void;
}