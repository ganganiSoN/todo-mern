import { Outlet } from "react-router";
import "./App.css";
import Header from "./components/header/header";
import SideBar from "./components/sidebar/sidebar";

function App() {
  return (
    <>
      <Header></Header>
      <SideBar></SideBar>
      <Outlet />
    </>
  );
}

export default App;
