import { useEffect, useState } from "react";
import { useTodoContext } from "../../home/context";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import CreateDialog from "../createDialog/CreateDialog";
import {
  todoTaskService,
  type ITaskItem,
} from "../../services/todoTaskService";
import { socketService } from "../../services/socketService";
import { FaEdit, FaStar, FaTrash } from "react-icons/fa";

function ToDoList() {
  const { todoSelection } = useTodoContext();

  const [name, setName] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [error, setError] = useState("");
  const [todoTaskList, setTodoTaskList] = useState<ITaskItem[]>([]);

  const fetchRecord = async () => {
    try {
      const records = await todoTaskService.getAll(todoSelection?._id);

      setTodoTaskList(records);
    } catch (error) {}
  };

  useEffect(() => {
    fetchRecord();

    const handleAdd = (todoTask: ITaskItem) => {
      setTodoTaskList((prev) => [...prev, todoTask]);
    };

    const handleUpdate = (todoTask: ITaskItem) => {
      setTodoTaskList((prev) =>
        prev.map((p) => (p._id === todoTask._id ? todoTask : p)),
      );
    };

    const handleDelete = (todoItem: ITaskItem) => {
      setTodoTaskList((prev) => prev.filter((p) => p._id !== todoItem._id));
    };

    socketService.onAddTodoTask(handleAdd);
    socketService.onUpdateTodoTask(handleUpdate);
    socketService.onDeleteTodoTask(handleDelete);

    return () => {
      socketService.offAddTodoTask(handleAdd);
      socketService.offUpdateTodoTask(handleUpdate);
      socketService.offDeleteTodoTask(handleDelete);
    };
  }, [todoSelection]);

  const handleOnSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name is required");
      return;
    }

    try {
      await todoTaskService.createTodoTask({
        name: trimmedName,
        todoId: todoSelection!._id,
      });

      setShowCreateDialog(false);
      setName("");
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <ListGroup className="mt-3">
        {todoTaskList.length ? (
          todoTaskList.map((ttl) => {
            return (
              <ListGroupItem
                key={ttl._id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>{ttl.name}</div>

                <div className="d-flex gap-3">
                  <FaStar style={{ cursor: "pointer" }}></FaStar>
                  <FaEdit style={{ cursor: "pointer" }}></FaEdit>
                  <FaTrash style={{ cursor: "pointer" }}></FaTrash>
                </div>
              </ListGroupItem>
            );
          })
        ) : (
          <ListGroupItem>No Rows Found</ListGroupItem>
        )}
      </ListGroup>
      <Button
        variant="secondary"
        className="mt-3"
        onClick={() => setShowCreateDialog(true)}
        disabled={!todoSelection?._id}
      >
        Add New
      </Button>

      <CreateDialog
        show={showCreateDialog}
        inputValue={name}
        updateInputValue={setName}
        onCancel={() => setShowCreateDialog(false)}
        title="Create Todo Task"
        key={"create-todo-dialog"}
        error={error}
        onSave={handleOnSave}
      ></CreateDialog>
    </>
  );
}

export default ToDoList;
