import { useState,useEffect  } from "react";
import axios from "axios";

const Parts = () => {
  const [form, setForm] = useState({
    part_name: "",
    category: "",
    cost: "",
    quantity: "",
  });

  const [part, setPart] = useState([]);
  const [edit_id, setEdit_id] = useState(null);
  const [showEform, setShowEform] = useState(false);

  useEffect(() => {
  axios.get("http://localhost:3000/parts")
    .then(res => setPart(res.data))
    .catch(err => console.log(err));
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPart = async () => {
    if (edit_id) {
      await axios.put(`http://localhost:3000/parts/${edit_id}`, form);
      setEdit_id(null);
      setShowEform(false);
    } else {
     await axios.post("http://localhost:3000/parts", form);
    }
     const res = await axios.get("http://localhost:3000/parts");
    setPart(res.data);


    setForm({
      part_name: "",
      category: "",
      cost: "",
      quantity: "",
    });
  };

 
    const deletePart = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/parts/${id}`);

    const res = await axios.get("http://localhost:3000/parts");
    setPart(res.data);
  } catch (err) {
    console.log(err);
  }
};
 
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">PARTS</h1>

        {/* Add Part FORM */}
        <div className="bg-white p-4 rounded shadow mb-6 flex gap-2 flex-wrap">
          <input
            name="part_name"
            value={form.part_name}
            onChange={handleChange}
            placeholder="Part Name"
            className="border p-2 rounded"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded"
          />
          <input
            name="cost"
            value={form.cost}
            onChange={handleChange}
            placeholder="Cost(For Each Part)"
            className="border p-2 rounded"
          />
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="border p-2 rounded"
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={addPart}
          >
            Add Part
          </button>
        </div>

        {/* Display Part details */}
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Part</th>
              <th className="p-2">Category</th>
              <th className="p-2">Cost(For Each Part)</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {part.map((p) => (
              <tr
                key={p.part_id}
                className="border-t hover:bg-gray-50 text-center"
              >
                <td className="p-2">{p.part_name}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">{p.cost}</td>
                <td className="p-2">{p.quantity}</td>

                <td className="p-2">
                  <button
                    onClick={() => {
                      setForm(p);
                      setEdit_id(p.part_id);
                      setShowEform(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deletePart(p.part_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit form */}
      {showEform && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px] shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Part</h2>

            <input
              name="part_name"
              value={form.part_name}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              name="cost"
              value={form.cost}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="border p-2 w-full mb-4 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEform(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={addPart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
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

export default Parts;