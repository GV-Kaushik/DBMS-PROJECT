import { useState, useEffect } from "react";
import api from "../../api";

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

  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/parts")
      .then((res) => setPart(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPart = async () => {
    if (edit_id) {
      await api.put(`/parts/${edit_id}`, form);
      setEdit_id(null);
      
    } else {
      await api.post("/parts", form);
    }
      setShowEform(false);

    const res = await api.get("/parts");
    setPart(res.data);

    setForm({
      part_name: "",
      category: "",
      cost: "",
      quantity: "",
    });
  };

  const deletePart = async (id) => {
    await api.delete(`/parts/${id}`);
    const res = await api.get("/parts");
    setPart(res.data);
  };

  const filteredParts = part.filter(
    (p) =>
      p.part_name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Parts</h1>

          <button
            onClick={() => setShowEform(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Part
          </button>
        </div>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search by part or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">Part</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Cost</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParts.map((p) => (
                <tr key={p.part_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{p.part_name}</td>
                  <td>{p.category}</td>
                  <td className="text-green-600">₹{p.cost}</td>
                  <td>{p.quantity}</td>

                  <td className="flex justify-center gap-2 p-2">
                    <button
                      onClick={() => {
                        setForm(p);
                        setEdit_id(p.part_id);
                        setShowEform(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deletePart(p.part_id)}
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

      {showEform && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="font-bold mb-4">
              {edit_id ? "Edit Part" : "Add Part"}
            </h2>

            <input
              name="part_name"
              placeholder="Part Name"
              value={form.part_name}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
            <input
              name="cost"
              placeholder="Cost(For Each Part)"
              value={form.cost}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
            <input
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEform(false)}>Cancel</button>
              <button
                onClick={addPart}
                className="bg-blue-600 text-white px-3 py-1 rounded"
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
