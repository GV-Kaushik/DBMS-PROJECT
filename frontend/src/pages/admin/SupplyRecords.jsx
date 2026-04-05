import { useState, useEffect } from "react";
import api from "../../api";

const SupplyRecords = () => {
  const [records, setRecords] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [parts, setParts] = useState([]);

  const [form, setForm] = useState({
    supplier_id: "",
    part_id: "",
    quantity: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const r = await api.get("/part-supply");
      const s = await api.get("/suppliers");
      const p = await api.get("/parts");

      setRecords(r.data);
      setSuppliers(s.data);
      setParts(p.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post("/part-supply", form);

      setShowForm(false);
      setForm({
        supplier_id: "",
        part_id: "",
        quantity: "",
      });

      loadData();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding record");
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/part-supply/${id}`);
    loadData();
  };

  const filtered = records.filter(
    (r) =>
      r.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
      r.part_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Supply Records</h1>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Record
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search supplier or part..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">Part</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r.supply_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{r.supplier_name}</td>
                  <td>{r.part_name}</td>
                  <td>{r.quantity}</td>

                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(r.supply_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="font-bold mb-4">Add Supply Record</h2>

            {/* SUPPLIER */}
            <select
              value={form.supplier_id}
              onChange={(e) =>
                setForm({ ...form, supplier_id: e.target.value })
              }
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.supplier_id} value={s.supplier_id}>
                  {s.supplier_name}
                </option>
              ))}
            </select>

            {/* PART */}
            <select
              value={form.part_id}
              onChange={(e) =>
                setForm({ ...form, part_id: e.target.value })
              }
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Part</option>
              {parts.map((p) => (
                <option key={p.part_id} value={p.part_id}>
                  {p.part_name}
                </option>
              ))}
            </select>

            {/* QUANTITY */}
            <input
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-3 py-1"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-3 py-1"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupplyRecords;