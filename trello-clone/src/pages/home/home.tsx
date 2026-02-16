import { Col, Container, Row } from "react-bootstrap";
import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { IItem } from "../../services/todoService";
import SideList from "../../components/side-list/SideList";
import ToDoList from "../../features/todo-list/todoListPage";

type TodoSelectionContextType = {
  todoSelection: IItem | undefined;
  setTodoSelection: Dispatch<SetStateAction<IItem | undefined>>;
};

export const TodoSelection = createContext<
  TodoSelectionContextType | undefined
>(undefined);

function Home() {
  const [todoSelection, setTodoSelection] = useState<undefined | IItem>(
    undefined,
  );

  return (
    <>
      <TodoSelection.Provider
        value={{
          todoSelection,
          setTodoSelection,
        }}
      >
        <Container>
          <Row>
            <Col sm={3}>
              <SideList></SideList>
            </Col>
            <Col sm={9}>
              <ToDoList></ToDoList>
            </Col>
          </Row>
        </Container>
      </TodoSelection.Provider>
    </>
  );
}

export default Home;
