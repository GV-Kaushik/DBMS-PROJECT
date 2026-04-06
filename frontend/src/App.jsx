import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// layouts
import AdminLayout from "./pages/Layouts/AdminLayout";
import DesignLayout from "./pages/Layouts/DesignLayout";
// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Cars from "./pages/admin/Cars";
import AssignParts from "./pages/admin/AssignParts";
import Parts from "./pages/admin/Parts";
import Suppliers from "./pages/admin/Suppliers";
import SupplyRecords from "./pages/admin/SupplyRecords";
import Production from "./pages/admin/Production";
import Factories from "./pages/admin/Factories";
import Employees from "./pages/admin/Employees";
import Dealers from "./pages/admin/Dealers";
import Sales from "./pages/admin/Sales";
import Users from "./pages/admin/Users";

// other roles
import Production_role from "./components/Production_role";
import Sales_role from "./components/Sales_role";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },

    // ADMIN ROUTES
    {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "cars", element: <Cars /> },
        { path: "assign-parts", element: <AssignParts /> },
        { path: "parts", element: <Parts /> },
        { path: "suppliers", element: <Suppliers /> },
        { path: "supply-records", element: <SupplyRecords /> },
        { path: "production", element: <Production /> },
        { path: "factories", element: <Factories /> },
        { path: "employees", element: <Employees /> },
        { path: "dealers", element: <Dealers /> },
        { path: "sales", element: <Sales /> },
        { path: "users", element: <Users /> },
      ],
    },
    {
      path: "/design",
      element: (
        <ProtectedRoute allowedRoles={["design"]}>
          <DesignLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Cars /> },

        { path: "cars", element: <Cars /> },
        { path: "assign-parts", element: <AssignParts /> },
        { path: "parts", element: <Parts /> },
        { path: "suppliers", element: <Suppliers /> },
        { path: "supply-records", element: <SupplyRecords /> },
      ],
    },
    {
      path: "/production",
      element: (
        <ProtectedRoute allowedRoles={["production"]}>
          <Production_role />
        </ProtectedRoute>
      ),
    },
    {
      path: "/sales",
      element: (
        <ProtectedRoute allowedRoles={["sales"]}>
          <Sales_role />
        </ProtectedRoute>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
