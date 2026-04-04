import { useState, useEffect } from "react";
import api from "../../api";

const Production = () => {
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    model_id: "",
    factory_id: "",
    quantity: "",
    production_date: "",
  });

  const [edit_id, setEdit_id] = useState(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const res = await api.get("/production");
      setRecords(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "model_id" ||
        name === "factory_id" ||
        name === "quantity"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (edit_id) {
        await api.put(`/production/${edit_id}`, form);
        setEdit_id(null);
      } else {
        await api.post("/production", form);
      }

      setForm({
        model_id: "",
        factory_id: "",
        quantity: "",
        production_date: "",
      });

      loadRecords();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`/production/${id}`);
      loadRecords();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-4">PRODUCTION RECORDS</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3">
        <input
          name="model_id"
          placeholder="Model ID"
          value={form.model_id}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="factory_id"
          placeholder="Factory ID"
          value={form.factory_id}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="date"
          name="production_date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
        >
          {edit_id ? "Update Record" : "Add Record"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Model </th>
              <th className="p-3 text-left">Factory </th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r.production_id} className="border-t hover:bg-gray-50">
                <td className="p-3"> {r.model_name} (ID:{r.model_id})</td>
                <td className="p-3">{r.factory_location} (ID: {r.factory_id})</td>
                <td className="p-3">{r.quantity}</td>
                <td className="p-3">{r.date}</td>

                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => {
                      setForm({
                        model_id: r.model_id,
                        factory_id: r.factory_id,
                        quantity: r.quantity,
                        date: r.date,
                      });
                      setEdit_id(r.production_id);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(r.production_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
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
  );
};

export default Production;