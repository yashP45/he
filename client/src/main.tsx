import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/LoginPage.tsx";
import RegistrationPage from "./components/RegistrationPage.tsx";
import AddProductPage from "./components/AddProductPage.tsx";
import GeneratePDFPage from "./components/GeneratePDFPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/add-product",
    element: <AddProductPage />,
  },
  {
    path: "/generate-pdf",
    element: <GeneratePDFPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
