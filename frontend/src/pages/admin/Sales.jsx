import { useState, useEffect } from "react";
import api from "../../api";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [cars, setCars] = useState([]);

  const [form, setForm] = useState({
    dealer_id: "",
    model_id: "",
    quantity: "",
    sale_date: "",
  });

  const [edit_id, setEdit_id] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const s = await api.get("/sales");
      const d = await api.get("/dealers");
      const c = await api.get("/cars");

      setSales(s.data);
      setDealers(d.data);
      setCars(c.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "dealer_id" || name === "model_id" || name === "quantity"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (edit_id) {
        await api.put(`/sales/${edit_id}`, form);
        setEdit_id(null);
      } else {
        await api.post("/sales", form);
      }

      setShowForm(false);
      setForm({
        dealer_id: "",
        model_id: "",
        quantity: "",
        sale_date: "",
      });

      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/sales/${id}`);
    loadData();
  };

  const filtered = sales.filter(
    (s) =>
      s.dealer_name.toLowerCase().includes(search.toLowerCase()) ||
      s.model_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Sales Records</h1>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Sale
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        {/* TABLE */}
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th>Dealer</th>
              <th>Model</th>
              <th>Qty</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.sale_id} className="border-t text-center">
                <td>{s.dealer_name}</td>
                <td>{s.model_name}</td>
                <td>{s.quantity}</td>
                <td>{s.sale_date?.split("T")[0]}</td>

                <td>
                  <button
                    onClick={() => {
                      setForm({
                        dealer_id: s.dealer_id,
                        model_id: s.model_id,
                        quantity: s.quantity,
                        sale_date: s.sale_date?.split("T")[0],
                      });
                      setEdit_id(s.sale_id);
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 px-2 py-1 text-white mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s.sale_id)}
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

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="font-bold mb-4">
              {edit_id ? "Edit Sale" : "Add Sale"}
            </h2>

            {/* DEALER DROPDOWN */}
            <select
              name="dealer_id"
              value={form.dealer_id}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Dealer</option>
              {dealers.map((d) => (
                <option key={d.dealer_id} value={d.dealer_id}>
                  {d.dealer_name}
                </option>
              ))}
            </select>

            {/* MODEL DROPDOWN */}
            <select
              name="model_id"
              value={form.model_id}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Car Model</option>
              {cars.map((c) => (
                <option key={c.model_id} value={c.model_id}>
                  {c.model_name}
                </option>
              ))}
            </select>

            <input
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />

            <input
              type="date"
              name="sale_date"
              value={form.sale_date}
              onChange={handleChange}
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-3 py-1"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-3 py-1"
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

export default Sales;