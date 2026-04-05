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
  const [error, setError] = useState("");
  const [edit_id, setEdit_id] = useState(null);

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
    // REQUIRED VALIDATION
    if (!form.supplier_id || !form.part_id || !form.quantity) {
      setError("All fields are required");
      return;
    }

    if (Number(form.quantity) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    try {
      if (edit_id) {
        await api.put(`/part-supply/${edit_id}`, form);
        setEdit_id(null);
      } else {
        await api.post("/part-supply", form);
      }

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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Supply Records
            </h1>
            <p className="text-sm text-gray-500">
              Track supplier deliveries and part supplies
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Record
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search supplier or part..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-400"
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
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
                  <td className="p-3 font-medium">{r.supplier_name}</td>
                  <td className="text-gray-600">{r.part_name}</td>
                  <td className="text-blue-600 font-semibold">
                    {r.quantity}
                  </td>

                  <td className="flex justify-center gap-2 p-2">
                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setForm({
                          supplier_id: r.supplier_id,
                          part_id: r.part_id,
                          quantity: r.quantity,
                        });
                        setEdit_id(r.supply_id);
                        setShowForm(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(r.supply_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center p-4 text-gray-500">No data found</p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {edit_id ? "Edit Record" : "Add Supply Record"}
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}

            <select
              required
              value={form.supplier_id}
              onChange={(e) =>
                setForm({ ...form, supplier_id: e.target.value })
              }
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.supplier_id} value={s.supplier_id}>
                  {s.supplier_name}
                </option>
              ))}
            </select>

            <select
              required
              value={form.part_id}
              onChange={(e) =>
                setForm({ ...form, part_id: e.target.value })
              }
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Part</option>
              {parts.map((p) => (
                <option key={p.part_id} value={p.part_id}>
                  {p.part_name}
                </option>
              ))}
            </select>

            <input
              type="number"
              required
              min="1"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
              className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={
                  !form.supplier_id ||
                  !form.part_id ||
                  !form.quantity ||
                  Number(form.quantity) <= 0
                }
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {edit_id ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupplyRecords;