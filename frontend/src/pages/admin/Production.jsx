import { useState, useEffect } from "react";
import api from "../../api";

const Production = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    factory_id: "",
    model_id: "",
    quantity: "",
    production_date: "",
  });

  const [edit_id, setEdit_id] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await api.get("/production");
    setData(res.data);
  };

  const handleSubmit = async () => {
    if (edit_id) {
      await api.put(`/production/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/production", form);
    }

    setShowForm(false);
    setForm({
      factory_id: "",
      model_id: "",
      quantity: "",
      production_date: "",
    });

    loadData();
  };

  const filtered = data.filter((d) =>
    d.model_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Production</h1>
          <button onClick={()=>setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add
          </button>
        </div>

        <input placeholder="Search..." value={search} onChange={(e)=>setSearch(e.target.value)} className="border p-2 w-full mb-4"/>

        <table className="w-full bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>Factory</th>
              <th>Model</th>
              <th>Qty</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((d) => (
              <tr key={d.production_id} className="border-t text-center">
                <td>{d.factory_location}</td>
                <td>{d.model_name}</td>
                <td>{d.quantity}</td>
                <td>{d.production_date?.split("T")[0]}</td>

                <td>
                  <button
                    onClick={() => {
                      setForm({
                        factory_id: d.factory_id,
                        model_id: d.model_id,
                        quantity: d.quantity,
                        production_date: d.production_date?.split("T")[0],
                      });
                      setEdit_id(d.production_id);
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 px-2 py-1 text-white mr-2"
                  >
                    Edit
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
            <input name="factory_id" placeholder="Factory ID" onChange={(e)=>setForm({...form,factory_id:e.target.value})} value={form.factory_id} className="border p-2 w-full mb-2"/>
            <input name="model_id" placeholder="Model ID" onChange={(e)=>setForm({...form,model_id:e.target.value})} value={form.model_id} className="border p-2 w-full mb-2"/>
            <input name="quantity" placeholder="Quantity" onChange={(e)=>setForm({...form,quantity:e.target.value})} value={form.quantity} className="border p-2 w-full mb-2"/>
            <input type="date" name="production_date" onChange={(e)=>setForm({...form,production_date:e.target.value})} value={form.production_date} className="border p-2 w-full mb-4"/>

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

export default Production;