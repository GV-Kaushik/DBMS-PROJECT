import { useState, useEffect } from "react";
import api from "../../api";

const Suppliers = () => {
  const [form, setForm] = useState({
    supplier_name: "",
    city: "",
    contact: "",
  });

  const [supplier, setSupplier] = useState([]);
  const [edit_id, setEdit_id] = useState(null);
  const [showEform, setShowEform] = useState(false);

  const [search, setSearch] = useState(""); 

  useEffect(() => {
    api.get("/suppliers")
      .then(res => setSupplier(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSupplier = async () => {
    if (edit_id) {
      await api.put(`/suppliers/${edit_id}`, form);
      setEdit_id(null);
      setShowEform(false);
    } else {
      await api.post("/suppliers", form);
    }

    const res = await api.get("/suppliers");
    setSupplier(res.data);

    setForm({
      supplier_name: "",
      city: "",
      contact: "",
    });
  };

  const deleteSupplier = async (id) => {
    await api.delete(`/suppliers/${id}`);
    const res = await api.get("/suppliers");
    setSupplier(res.data);
  };


  const filteredSuppliers = supplier.filter((s) =>
    s.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">

     
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Suppliers</h1>

          <button
            onClick={() => setShowEform(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Add Supplier
          </button>
        </div>

      
        <input
          type="text"
          placeholder="Search by supplier or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

      
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">City</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSuppliers.map((s) => (
                <tr key={s.supplier_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{s.supplier_name}</td>
                  <td>{s.city}</td>
                  <td>{s.contact}</td>

                  <td className="flex justify-center gap-2 p-2">
                    <button
                      onClick={() => {
                        setForm(s);
                        setEdit_id(s.supplier_id);
                        setShowEform(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteSupplier(s.supplier_id)}
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

  
      {showEform && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">

            <h2 className="text-lg font-bold mb-4">
              {edit_id ? "Edit Supplier" : "Add Supplier"}
            </h2>

            <input
              name="supplier_name"
              placeholder="Supplier Name"
              value={form.supplier_name}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              name="contact"
              placeholder="Contact"
              value={form.contact}
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
                onClick={addSupplier}
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

export default Suppliers;