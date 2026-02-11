import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";
import { useTodoContext } from "../../home/context";
import { socketService } from "../../services/socketService";
import { todoApiService, type IItem } from "../../services/todoService";

function SideList() {
  const { setTodoSelection } = useTodoContext();

  const [itemList, setItemList] = useState<IItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string>("");
  const [editItem, setEditItem] = useState<IItem | null>(null);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const fetchRecords = async () => {
    try {
      const items = await todoApiService.getAll();

      setItemList(items);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const socket = socketService.connect();

    if (!socket) return;

    const handleAdd = (todo: IItem) => {
      setItemList((prev) => [...prev, todo]);
    };

    const handleUpdate = (todo: IItem) => {
      setItemList((prev) => prev.map((p) => (p._id === todo._id ? todo : p)));
    };

    const handleDelete = (todo: IItem) => {
      setItemList((prev) => prev.filter((p) => p._id !== todo._id));
    };

    fetchRecords();

    socketService.onAdd(handleAdd);
    socketService.onUpdate(handleUpdate);
    socketService.onDelete(handleDelete);

    return () => {
      socketService.offAdd(handleAdd);
      socketService.offUpdate(handleUpdate);
      socketService.offDelete(handleDelete);
    };
  }, []);

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name is required");
      return;
    }

    try {
      if (editItem) {
        await todoApiService.update(editItem._id, trimmedName);
      } else {
        await todoApiService.create(trimmedName);
      }
      handleClose();
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deletedId) return;

    try {
      await todoApiService.remove(deletedId);
      setDeletedId(null);
      setShowConfirmDialog(false);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleOpen = (item?: IItem) => {
    setEditItem(item ?? null);
    setName(item?.name ?? "");
    setError("");
    setShowModal(true);
  };

  const handleClose = () => {
    setEditItem(null);
    setName("");
    setError("");
    setShowModal(false);
  };

  return (
    <>
      <ListGroup className="mt-3">
        {itemList.map((item) => (
          <ListGroupItem
            key={item._id}
            className="d-flex justify-content-between"
            onClick={() => setTodoSelection(item)}
          >
            <Button variant="link">{item.name}</Button>
            <span>
              <Button
                variant="outline-primary"
                size="sm"
                className="ms-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpen(item);
                }}
              >
                <i className="bi bi-pencil-square"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={() => {
                  setDeletedId(item._id);
                  setShowConfirmDialog(true);
                }}
              >
                <i className="bi bi-trash-fill"></i>
              </Button>
            </span>
          </ListGroupItem>
        ))}
      </ListGroup>

      <Button variant="secondary" onClick={() => handleOpen()} className="mt-3">
        Add New
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <ModalHeader closeButton>
          <ModalTitle>{editItem ? "Edit Item" : "Add New Item"}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormControl
            required
            className="form-container"
            placeholder="Item Name"
            name="itemName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isInvalid={!!error}
          ></FormControl>
          {error && <p className="text-danger mt-2">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editItem ? "Update" : "Add New"}
          </Button>
        </ModalFooter>
      </Modal>

      <ConfirmationDialog
        key={"delete-confirm-dialog"}
        message="Are You Sure?"
        show={showConfirmDialog}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDialog(false)}
      ></ConfirmationDialog>
    </>
  );
}

export default SideList;
