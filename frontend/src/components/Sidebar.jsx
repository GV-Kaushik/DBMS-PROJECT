import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const active = "bg-blue-800";
  const normal = "hover:bg-gray-800";

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between">
      <div>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold">CMS</h1>
          <p className="text-sm text-gray-400">Car Manufacturing</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-semibold">Admin Panel</h2>
          <p className="text-sm text-gray-400">Administrator</p>
        </div>

        <ul className="p-3 space-y-2 text-sm">
          <li
            onClick={() => navigate("/admin")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin" ? active : normal
            }`}
          >
            Dashboard
          </li>

          <li
            onClick={() => navigate("/admin/cars")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/cars" ? active : normal
            }`}
          >
            Car Models
          </li>

          <li
            onClick={() => navigate("/admin/assign-parts")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/assign-parts" ? active : normal
            }`}
          >
            Assign Parts
          </li>

          <li
            onClick={() => navigate("/admin/parts")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/parts" ? active : normal
            }`}
          >
            Parts
          </li>

          <li
            onClick={() => navigate("/admin/suppliers")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/suppliers" ? active : normal
            }`}
          >
            Suppliers
          </li>

          <li
            onClick={() => navigate("/admin/supply-records")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/supply-records" ? active : normal
            }`}
          >
            Supply Records
          </li>

          <li
            onClick={() => navigate("/admin/production")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/production" ? active : normal
            }`}
          >
            Production Records
          </li>

          <li
            onClick={() => navigate("/admin/factories")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/factories" ? active : normal
            }`}
          >
            Factories
          </li>

          <li
            onClick={() => navigate("/admin/employees")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/employees" ? active : normal
            }`}
          >
            Employees
          </li>

          <li
            onClick={() => navigate("/admin/dealers")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/dealers" ? active : normal
            }`}
          >
            Dealers
          </li>

          <li
            onClick={() => navigate("/admin/sales")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/sales" ? active : normal
            }`}
          >
            Sales
          </li>

          <li
            onClick={() => navigate("/admin/users")}
            className={`px-3 py-2 rounded cursor-pointer ${
              location.pathname === "/admin/users" ? active : normal
            }`}
          >
            Manage Users
          </li>
        </ul>
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded text-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
