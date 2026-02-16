import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

export interface IConfirmDialog {
  show: boolean;
  title: string;
  inputValue: string;
  updateInputValue: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  error: string;
}

function CreateDialog({
  show,
  title,
  inputValue,
  updateInputValue,
  onCancel,
  onSave,
  error,
}: IConfirmDialog) {
  //   const [value, setInputValue] = useState(inputValue);

  return (
    <>
      <Modal show={show}>
        <ModalHeader closeButton onClick={onCancel}>
          <ModalTitle> {title} </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormControl
            required
            className="form-container"
            placeholder="ItemName"
            name="itemName"
            value={inputValue}
            onChange={(e) => updateInputValue(e.target.value)}
            isInvalid={!!error}
          ></FormControl>
          {error && <p className="text-danger mt-2">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default CreateDialog;
