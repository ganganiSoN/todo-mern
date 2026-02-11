import { Col, Container, Row } from "react-bootstrap";
import SideList from "../components/side-list/SideList";
import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { IItem } from "../services/todoService";

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
            <Col sm={9}>Column 2</Col>
          </Row>
        </Container>
      </TodoSelection.Provider>
    </>
  );
}

export default Home;
