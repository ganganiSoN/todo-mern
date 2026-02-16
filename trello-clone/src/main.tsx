import { createRoot } from "react-dom/client";
import { AppProviders } from "./app/providers";
import { StrictMode } from "react";
import { RouterProvider } from "react-router";
import { router } from "./app/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router}></RouterProvider>
    </AppProviders>
  </StrictMode>,
);
