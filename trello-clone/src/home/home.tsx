import { Col, Container, Row } from "react-bootstrap";
import SideList from "../components/side-list/SideList";

function Home() {
  return (
    <>
      <Container>
        <Row>
          <Col sm={2}>
            <SideList></SideList>
          </Col>
          <Col sm={10}>Column 2</Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
