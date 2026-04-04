import { useState, useEffect } from "react";
import api from "../../api";

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [form, setForm] = useState({
    dealer_name: "",
    city: "",
    contact: "",
  });

  const [edit_id, setEdit_id] = useState(null);
  const [showEform, setShowEform] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDealers();
  }, []);

  const loadDealers = async () => {
    const res = await api.get("/dealers");
    setDealers(res.data);
  };

  const handleSubmit = async () => {
    if (edit_id) {
      await api.put(`/dealers/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/dealers", form);
    }

    setShowEform(false);
    setForm({ dealer_name: "", city: "", contact: "" });
    loadDealers();
  };

  const handleDelete = async (id) => {
    await api.delete(`/dealers/${id}`);
    loadDealers();
  };

  const filtered = dealers.filter((d) =>
    d.dealer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">DEALERS</h1>

          <button onClick={()=>setShowEform(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Dealer
          </button>
        </div>

        <input placeholder="Search..." value={search} onChange={(e)=>setSearch(e.target.value)} className="border p-2 w-full mb-4"/>

        <table className="w-full bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((d) => (
              <tr key={d.dealer_id} className="border-t text-center">
                <td>{d.dealer_name}</td>
                <td>{d.city}</td>
                <td>{d.contact}</td>

                <td>
                  <button
                    onClick={() => {
                      setForm(d);
                      setEdit_id(d.dealer_id);
                      setShowEform(true);
                    }}
                    className="bg-yellow-500 px-2 py-1 text-white mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(d.dealer_id)}
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

      {showEform && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <input placeholder="Name" value={form.dealer_name} onChange={(e)=>setForm({...form,dealer_name:e.target.value})} className="border p-2 w-full mb-2"/>
            <input placeholder="City" value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})} className="border p-2 w-full mb-2"/>
            <input placeholder="Contact" value={form.contact} onChange={(e)=>setForm({...form,contact:e.target.value})} className="border p-2 w-full mb-4"/>

            <div className="flex justify-end gap-2">
              <button onClick={()=>setShowEform(false)} className="bg-gray-300 px-3 py-1">Cancel</button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-1">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dealers;