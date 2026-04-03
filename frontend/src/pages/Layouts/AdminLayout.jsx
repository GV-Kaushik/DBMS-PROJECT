import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        <Outlet />
      </div>
    </div>
  );
}