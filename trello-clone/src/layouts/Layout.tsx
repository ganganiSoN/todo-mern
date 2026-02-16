import { Outlet } from "react-router";
import Header from "../shared/components/header/header";
import SideBar from "../components/sidebar/sidebar";

function Layout() {
  return (
    <>
      <Header></Header>
      <SideBar></SideBar>
      <Outlet />
    </>
  );
}

export default Layout;
