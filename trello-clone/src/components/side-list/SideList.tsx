import { useEffect, useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";
import { useTodoContext } from "../../home/context";
import { socketService } from "../../services/socketService";
import { todoApiService, type IItem } from "../../services/todoService";
import CreateDialog from "../createDialog/CreateDialog";

function SideList() {
  const { setTodoSelection } = useTodoContext();

  const [itemList, setItemList] = useState<IItem[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string>("");
  const [editItem, setEditItem] = useState<IItem | null>(null);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

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
    setShowCreateDialog(true);
  };

  const handleClose = () => {
    setEditItem(null);
    setName("");
    setError("");
    setShowCreateDialog(false);
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

      <Button
        variant="secondary"
        onClick={() => setShowCreateDialog(true)}
        className="mt-3"
      >
        Add New
      </Button>

      <CreateDialog
        key={"create-dialog"}
        inputValue={name}
        updateInputValue={setName}
        show={showCreateDialog}
        title="Create ToDo"
        error={error}
        onSave={() => handleSubmit()}
        onCancel={() => setShowCreateDialog(false)}
      ></CreateDialog>

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
