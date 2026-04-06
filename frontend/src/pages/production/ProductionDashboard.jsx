import { useEffect, useState } from "react";
import api from "../../api";

const ProductionDashboard = () => {
  const [stats, setStats] = useState({
    totalProduction: 0,
    totalFactories: 0,
    totalEmployees: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const p = await api.get("/production");
      const f = await api.get("/factories");
      const e = await api.get("/employees");

      setStats({
        totalProduction: p.data.length,
        totalFactories: f.data.length,
        totalEmployees: e.data.length,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Production Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of production activities and resources
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Production */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Production Records</h2>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalProduction}
          </p>
        </div>

        {/* Factories */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Factories</h2>
          <p className="text-2xl font-bold text-green-600">
            {stats.totalFactories}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Employees</h2>
          <p className="text-2xl font-bold text-purple-600">
            {stats.totalEmployees}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductionDashboard;