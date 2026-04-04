import { useState, useEffect } from "react";
import api from "../../api";

const Cars = () => {
  const [form, setForm] = useState({
    model_name: "",
    company: "",
    price: "",
    engine_type: "",
  });

  const [car, setCar] = useState([]);
  const [edit_id, setEdit_id] = useState(null);
  const [showEform, setShowEform] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/cars")
      .then((res) => setCar(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCar = async () => {
    if (edit_id) {
      await api.put(`/cars/${edit_id}`, form);
      setEdit_id(null);
     
    } else {
      await api.post("/cars", form);
    }
      setShowEform(false);

    const res = await api.get("/cars");
    setCar(res.data);

    setForm({
      model_name: "",
      company: "",
      price: "",
      engine_type: "",
    });
  };

  const deleteCar = async (id) => {
    await api.delete(`/cars/${id}`);
    const res = await api.get("/cars");
    setCar(res.data);
  };

  const filteredCars = car.filter(
    (c) =>
      c.model_name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Car Models</h1>

          <button
            onClick={() => setShowEform(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Add Model
          </button>
        </div>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search by model or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Engine</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCars.map(
                (
                  car, // ✅ ONLY CHANGE HERE
                ) => (
                  <tr key={car.model_id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{car.model_name}</td>
                    <td>{car.company}</td>

                    <td className="text-green-600 font-medium">₹{car.price}</td>

                    <td>
                      <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                        {car.engine_type}
                      </span>
                    </td>

                    <td className="flex justify-center gap-2 p-2">
                      <button
                        onClick={() => {
                          setForm(car);
                          setEdit_id(car.model_id);
                          setShowEform(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteCar(car.model_id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEform && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {edit_id ? "Edit Car" : "Add Car"}
            </h2>

            <input
              name="model_name"
              value={form.model_name}
              onChange={handleChange}
              placeholder="Model Name"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              name="engine_type"
              value={form.engine_type}
              onChange={handleChange}
              placeholder="Engine Type"
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
                onClick={addCar}
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

export default Cars;
