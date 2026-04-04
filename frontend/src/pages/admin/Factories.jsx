import React, { useState, useEffect } from "react";
import api from "../../api";

const Factories = () => {
  const [factories, setFactories] = useState([]);

  const [form, setForm] = useState({
    location: "",
    capacity: "",
  });

  const [edit_id, setEdit_id] = useState(null);

  useEffect(() => {
    loadFactories();
  }, []);

  const loadFactories = async () => {
    try {
      const res = await api.get("/factories");
      setFactories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //add / update
  const handleSubmit = async () => {
    try {
      if (edit_id) {
        await api.put(`/factories/${edit_id}`, form);
        setEdit_id(null);
      } else {
        await api.post("/factories", form);
      }

      setForm({
        location: "",
        capacity: "",
      });

      loadFactories();
    } catch (err) {
      console.log(err);
    }
  };

  //delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/factories/${id}`);
      loadFactories();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-4">FACTORIES</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3">
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
        >
          {edit_id ? "Update Factory" : "Add Factory"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Capacity</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {factories.map((f) => (
              <tr key={f.factory_id} className="border-t">
                <td className="p-3">{f.location}</td>
                <td className="p-3">{f.capacity}</td>

                <td className="p-3 text-center space-x-2">
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setForm({
                        location: f.location,
                        capacity: f.capacity,
                      });
                      setEdit_id(f.factory_id);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(f.factory_id)}
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

export default Factories;