import Login from "../pages/login/Login";
import SignUp from "../pages/signup/SignUp";
import { createBrowserRouter } from "react-router";
import Layout from "../layouts/Layout";
import AuthLayout from "../layouts/auth-layout/AuthLayout";
import NotFound from "../shared/components/notFound/NotFound";
import Home from "../pages/home/home";
import { SocketProvider } from "../shared/providers/SocketProvider";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SocketProvider>
        <Layout />
      </SocketProvider>
    ),
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
