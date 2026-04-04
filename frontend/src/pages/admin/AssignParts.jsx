import { useState, useEffect } from "react";
import api from "../../api";

const AssignParts = () => {
  const [form, setForm] = useState({
    model_id: "",
    part_id: "",
    quantity_required: "",
  });

  const [assign, setAssign] = useState([]);
  const [cars, setCars] = useState([]);
  const [parts, setParts] = useState([]);
  const [showAssiForm, setshowAssiForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const a = await api.get("/assign");
    const c = await api.get("/cars");
    const p = await api.get("/parts");

    setAssign(a.data);
    setCars(c.data);
    setParts(p.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addAssign = async () => {
    await api.post("/assign", form);

    fetchData();
    setshowAssiForm(false);

    setForm({
      model_id: "",
      part_id: "",
      quantity_required: "",
    });
  };

  const deleteAssign = async (id) => {
    await api.delete(`/assign/${id}`);
    fetchData();
  };

  return (
    <>
      <div className="p-6">

        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Assign Parts</h1>

          <button
            onClick={() => setshowAssiForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Assign Part
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">Car Model</th>
                <th className="p-3 text-left">Part</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {assign.map((a) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{a.model_name}</td>
                  <td>{a.part_name}</td>
                  <td>{a.quantity_required}</td>

                  <td className="text-center">
                    <button
                      onClick={() => deleteAssign(a.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
      {/*Assign form*/}

      {showAssiForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="font-bold mb-4">Assign Part</h2>

            <select name="model_id" value={form.model_id} onChange={handleChange} className="border p-2 w-full mb-2">
              <option value="">Select Car</option>
              {cars.map((c) => (
                <option key={c.model_id} value={c.model_id}>
                  {c.model_name}
                </option>
              ))}
            </select>

            <select name="part_id" value={form.part_id} onChange={handleChange} className="border p-2 w-full mb-2">
              <option value="">Select Part</option>
              {parts.map((p) => (
                <option key={p.part_id} value={p.part_id}>
                  {p.part_name}
                </option>
              ))}
            </select>

            <input name="quantity_required" placeholder="Qunatity Required" value={form.quantity_required} onChange={handleChange} className="border p-2 w-full mb-4" />

            <div className="flex justify-end gap-2">
              <button onClick={() => setshowAssiForm(false)}>Cancel</button>
              <button onClick={addAssign} className="bg-blue-600 text-white px-3 py-1 rounded">Assign</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignParts;