import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaStore,
  FaCar,
  FaMoneyBillWave,
  FaHistory,
} from "react-icons/fa";

const SalesDashboard = () => {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    sales: 0,
    dealers: 0,
    models: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const s = await api.get("/sales");
      const d = await api.get("/dealers");
      const c = await api.get("/cars");

      // calculate revenue
      let totalRevenue = 0;

      s.data.forEach((sale) => {
        const model = c.data.find((m) => m.model_id === sale.model_id);
        if (model) {
          totalRevenue += sale.quantity * model.price;
        }
      });

      setCounts({
        sales: s.data.length,
        dealers: d.data.length,
        models: c.data.length,
        revenue: totalRevenue,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of sales performance</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaChartLine className="text-blue-500 text-2xl" />
          <div>
            <h2 className="text-xl font-bold">{counts.sales}</h2>
            <p className="text-gray-500 text-sm">Total Sales</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaStore className="text-yellow-500 text-2xl" />
          <div>
            <h2 className="text-xl font-bold">{counts.dealers}</h2>
            <p className="text-gray-500 text-sm">Dealers</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaCar className="text-green-500 text-2xl" />
          <div>
            <h2 className="text-xl font-bold">{counts.models}</h2>
            <p className="text-gray-500 text-sm">Car Models</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaMoneyBillWave className="text-purple-500 text-2xl" />
          <div>
            <h2 className="text-xl font-bold">₹ {counts.revenue}</h2>
            <p className="text-gray-500 text-sm">Revenue</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div
          onClick={() => navigate("/sales/dealers")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <FaStore className="text-yellow-500 text-xl mb-2" />
          <h3 className="font-semibold">Dealers</h3>
          <p className="text-sm text-gray-500">Manage dealer records</p>
        </div>

        <div
          onClick={() => navigate("/sales/record")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <FaMoneyBillWave className="text-green-500 text-xl mb-2" />
          <h3 className="font-semibold">Record Sale</h3>
          <p className="text-sm text-gray-500">Add new sales transaction</p>
        </div>

        <div
          onClick={() => navigate("/sales/history")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <FaHistory className="text-blue-500 text-xl mb-2" />
          <h3 className="font-semibold">Sales History</h3>
          <p className="text-sm text-gray-500">View past sales records</p>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
