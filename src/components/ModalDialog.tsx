import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

type Props = {
  isOpen: boolean,
  onOpenChange: () => void,
  size?: "md" | "xs" | "sm" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"
  header?: React.ReactNode
  confirmText?: string
  children?: React.ReactNode,
  scrollBehavior?: "inside" | "outside" | "default",
  confirmButtonDisabled?: boolean
  onConfirm: () => void
  onCloseAction?: () => void
}

const ModalDialog = ({ isOpen, onOpenChange, children, size="md", header, onConfirm, onCloseAction, scrollBehavior="default", confirmButtonDisabled=false, confirmText="Confirm" }: Props) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={(isOpen) => {
      if (!isOpen && onCloseAction) { onCloseAction() }
      onOpenChange()
    }} size={size} scrollBehavior={scrollBehavior == "default" ? undefined : scrollBehavior}
     classNames={{
      body: 'py-0',
     }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{header}</ModalHeader>
            <ModalBody>
              {children}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button isDisabled={confirmButtonDisabled} color="primary" onPress={() => onConfirm()}>
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalDialog