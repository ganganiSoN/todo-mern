import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { useTodoContext } from "./todoList.context";
import { useTodoListPage } from "./useTodoListTask";
import CreateDialog from "../../shared/components/createDialog/CreateDialog";
import ConfirmationDialog from "../../shared/components/confirmationDialog/ConfirmationDialog";

function ToDoList() {
  const { todoSelection } = useTodoContext();

  const {
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
    setDeletedRecord,
    handleSave,
    handleUpdate,
    handleDelete,
    handleFavourite,
  } = useTodoListPage(todoSelection);

  return (
    <>
      <ListGroup className="mt-3">
        {todoTaskList.length ? (
          todoTaskList.map((ttl) => (
            <ListGroupItem
              key={ttl._id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>{ttl.name}</div>

              <div className="d-flex gap-3">
                <FaStar
                  style={{
                    cursor: "pointer",
                    color: ttl.favourite ? "gold" : "gray",
                  }}
                  onClick={() => handleFavourite(ttl)}
                />
                <FaEdit
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setEditRecord(ttl);
                    setName(ttl.name);
                    setShowCreateDialog(true);
                  }}
                />
                <FaTrash
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => {
                    setDeletedRecord(ttl);
                    setShowConfirmationDialog(true);
                  }}
                />
              </div>
            </ListGroupItem>
          ))
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
        title={editRecord ? "Update Todo Task" : "Create Todo Task"}
        error={error}
        onSave={editRecord ? handleUpdate : handleSave}
      />

      <ConfirmationDialog
        show={showConfirmationDialog}
        onCancel={() => setShowConfirmationDialog(false)}
        onConfirm={handleDelete}
        message="Are you sure?"
      />
    </>
  );
}

export default ToDoList;
