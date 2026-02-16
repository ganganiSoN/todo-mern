import { useEffect, useState } from "react";
import type { IItem } from "../../services/todoService";
import { todoTaskService } from "./todoList.service";
import type { ITaskItem } from "./todoList.types";
import { useSocket } from "../../shared/providers/SocketProvider";

export function useTodoListPage(todoSelection: IItem | undefined) {
  const socket = useSocket();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [todoTaskList, setTodoTaskList] = useState<ITaskItem[]>([]);
  const [deletedRecord, setDeletedRecord] = useState<ITaskItem | null>(null);
  const [editRecord, setEditRecord] = useState<ITaskItem | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const records = await todoTaskService.getAll(todoSelection?._id);

        setTodoTaskList(records);
      } catch (error: any) {
        setError(error.message || "Failed to load tasks");
      }
    };

    fetchRecord();
  }, [todoSelection?._id]);

  // socket listener
  useEffect(() => {
    if (!socket) return;

    const handleCreate = (todoTask: ITaskItem) => {
      setTodoTaskList((prev) => [...prev, todoTask]);
    };

    const handleUpdate = (todoTask: ITaskItem) => {
      setTodoTaskList((prev) =>
        prev.map((p) => (p._id === todoTask._id ? todoTask : p)),
      );
    };

    const handleDelete = (todoTask: ITaskItem) => {
      setTodoTaskList((prev) => prev.filter((p) => p._id !== todoTask._id));
    };

    socket.on("todoTask:created", handleCreate);
    socket.on("todoTask:updated", handleUpdate);
    socket.on("todoTask:deleted", handleDelete);

    return () => {
      socket.off("todoTask:created", handleCreate);
      socket.off("todoTask:updated", handleUpdate);
      socket.off("todoTask:deleted", handleDelete);
    };
  }, [socket]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required");
      return;
    }

    await todoTaskService.createTodoTask({
      name: trimmedName,
      todoId: todoSelection!._id,
      favourite: false,
    });

    setShowCreateDialog(false);
    setName("");
  };

  const handleUpdate = async () => {
    if (!editRecord) return;

    await todoTaskService.updateTodoTask({
      ...editRecord,
      name: name.trim(),
    });

    setEditRecord(null);
    setName("");
    setShowCreateDialog(false);
  };

  const handleDelete = async () => {
    if (!deletedRecord) return;

    await todoTaskService.deleteTodoTask(deletedRecord);
    setDeletedRecord(null);
    setShowConfirmationDialog(false);
  };

  const handleFavourite = async (item: ITaskItem) => {
    await todoTaskService.updateFavourite({
      _id: item._id,
      favourite: !item.favourite,
    });
  };

  return {
    name,
    setName,
    error,
    showCreateDialog,
    setShowCreateDialog,
    showConfirmationDialog,
    setShowConfirmationDialog,
    todoTaskList,
    editRecord,
    setEditRecord,
    deletedRecord,
    setDeletedRecord,
    handleSave,
    handleUpdate,
    handleDelete,
    handleFavourite,
  };
}
