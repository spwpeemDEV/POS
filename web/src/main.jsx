import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Package from "./pages/Package.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import User from "./pages/User.jsx";
import Sale from "./pages/Sale.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Package />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/sale",
    element: <Sale />,
  },
  {
    path: "/product",
    element: <Product />,
  },
  {
    path: "/user",
    element: <User />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
