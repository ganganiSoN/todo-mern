import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from "react-bootstrap";

export interface IConfirmDialog {
  show: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmationDialog({
  show,
  message,
  onCancel,
  onConfirm,
}: IConfirmDialog) {
  return (
    <>
      <Modal show={show}>
        <ModalTitle className="ps-2">Confirmation Dialog</ModalTitle>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ConfirmationDialog;
