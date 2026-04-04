import { useState, useEffect } from "react";
import api from "../../api";

const Factories = () => {
  const [factories, setFactories] = useState([]);
  const [form, setForm] = useState({ location: "", capacity: "" });

  const [edit_id, setEdit_id] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadFactories();
  }, []);

  const loadFactories = async () => {
    const res = await api.get("/factories");
    setFactories(res.data);
  };

  const handleSubmit = async () => {
    if (edit_id) {
      await api.put(`/factories/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/factories", form);
    }

    setShowForm(false);
    setForm({ location: "", capacity: "" });
    loadFactories();
  };

  const handleDelete = async (id) => {
    await api.delete(`/factories/${id}`);
    loadFactories();
  };

  const filtered = factories.filter((f) =>
    f.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Factories</h1>
          <button onClick={()=>setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Factory
          </button>
        </div>

        <input placeholder="Search..." value={search} onChange={(e)=>setSearch(e.target.value)} className="border p-2 w-full mb-4"/>

        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th>Location</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((f) => (
              <tr key={f.factory_id} className="border-t text-center">
                <td>{f.location}</td>
                <td>{f.capacity}</td>
                <td>
                  <button
                    onClick={() => {
                      setForm(f);
                      setEdit_id(f.factory_id);
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 px-2 py-1 text-white mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(f.factory_id)}
                    className="bg-red-500 px-2 py-1 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <input placeholder="Location" value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} className="border p-2 w-full mb-2"/>
            <input placeholder="Capacity" value={form.capacity} onChange={(e)=>setForm({...form,capacity:e.target.value})} className="border p-2 w-full mb-4"/>

            <div className="flex justify-end gap-2">
              <button onClick={()=>setShowForm(false)} className="bg-gray-300 px-3 py-1">Cancel</button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-1">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Factories;