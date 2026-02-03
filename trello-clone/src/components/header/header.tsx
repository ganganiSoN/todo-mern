import { Button, Container, Form, Navbar, NavbarBrand } from "react-bootstrap";

function Header() {
  return (
    <>
      <Navbar bg="primary">
        <Container>
          <NavbarBrand href="home">Home</NavbarBrand>
          <Form className="d-flex">
            <Form.Control type="search" className="me-2" />
            <Button variant="secondary">Search</Button>
          </Form>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
