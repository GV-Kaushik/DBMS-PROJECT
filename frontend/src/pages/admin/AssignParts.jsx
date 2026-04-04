import { useState, useEffect } from "react";
import axios from "axios";

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
    try {
      const a = await axios.get("http://localhost:3000/assign");
      const c = await axios.get("http://localhost:3000/cars");
      const p = await axios.get("http://localhost:3000/parts");

      setAssign(a.data);
      setCars(c.data);
      setParts(p.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addAssign = async () => {
    try {
      await axios.post("http://localhost:3000/assign", form);

      fetchData();
      setshowAssiForm(false);

      setForm({
        model_id: "",
        part_id: "",
        quantity_required: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAssign = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/assign/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Assign Parts to Models</h1>

          <button
            onClick={() => setshowAssiForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Assign Part
          </button>
        </div>

        {/* Display Details */}
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Car Model</th>
              <th className="p-2">Part Name</th>
              <th className="p-2">Required Qty</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {assign.map((a) => (
              <tr key={a.id} className="border-t text-center">
                <td className="p-2">{a.model_name}</td>
                <td className="p-2">{a.part_name}</td>
                <td className="p-2">{a.quantity_required}</td>

                <td className="p-2">
                  <button
                    onClick={() => deleteAssign(a.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Form */}
      {showAssiForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-lg font-bold mb-4">Assign Part to Car Model</h2>

            <select
              name="model_id"
              value={form.model_id}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Car</option>
              {cars.map((c) => (
                <option key={c.model_id} value={c.model_id}>
                  {c.model_name}
                </option>
              ))}
            </select>

            <select
              name="part_id"
              value={form.part_id}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Part</option>
              {parts.map((p) => (
                <option key={p.part_id} value={p.part_id}>
                  {p.part_name}
                </option>
              ))}
            </select>

            <input
              name="quantity_required"
              value={form.quantity_required}
              onChange={handleChange}
              placeholder="Required Quantity"
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setshowAssiForm(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={addAssign}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignParts;
