import { useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";

function SideList() {
  const [itemList, setItemList] = useState<string[]>([]);

  const handleAddNewClick = () => {
    setItemList([...itemList, "Test 1"]);
  };

  return (
    <>
      <ListGroup>
        {itemList.map((il) => (
          <ListGroupItem>{il}</ListGroupItem>
        ))}
      </ListGroup>

      <Button variant="secondary" onClick={handleAddNewClick}>
        Add New
      </Button>
    </>
  );
}

export default SideList;
