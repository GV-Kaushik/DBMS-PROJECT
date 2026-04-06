import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-700">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Overview of your system
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;