import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./authentication/auth-layout/AuthLayout.tsx";
import Login from "./authentication/login/Login.tsx";
import Home from "./home/home.tsx";
import SignUp from "./authentication/signup/SignUp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="home" element={<Home />}></Route>
        </Route>

        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />}></Route>
          <Route path="signup" element={<SignUp />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
