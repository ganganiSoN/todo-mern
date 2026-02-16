import { Container } from "react-bootstrap";
import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <>
      <Container fluid className="fluid">
        <Outlet />
      </Container>
    </>
  );
}

export default AuthLayout;
