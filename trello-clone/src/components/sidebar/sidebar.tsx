import { Offcanvas, OffcanvasHeader } from "react-bootstrap";

function SideBar() {
  return (
    <>
      <Offcanvas show={false}>
        <OffcanvasHeader closeButton>
          <Offcanvas.Title>TaskHub</Offcanvas.Title>
        </OffcanvasHeader>
      </Offcanvas>
    </>
  );
}

export default SideBar;
