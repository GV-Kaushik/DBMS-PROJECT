import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const DesignLayout = () => {
  return (
    <div className="flex">
      <Sidebar role="design" />
      <div className="flex-1 bg-gray-100 min-h-screen p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DesignLayout;