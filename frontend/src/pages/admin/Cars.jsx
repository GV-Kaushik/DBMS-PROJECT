import { useState,useEffect  } from "react";
import axios from "axios";

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

  useEffect(() => {
  axios.get("http://localhost:3000/cars")
    .then(res => setCar(res.data))
    .catch(err => console.log(err));
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCar = async () => {
    if (edit_id) {
      await axios.put(`http://localhost:3000/cars/${edit_id}`, form);
      setEdit_id(null);
      setShowEform(false);
    } else {
     await axios.post("http://localhost:3000/cars", form);
    }
     const res = await axios.get("http://localhost:3000/cars");
    setCar(res.data);


    setForm({
      model_name: "",
      company: "",
      price: "",
      engine_type: "",
    });
  };

 
    const deleteCar = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/cars/${id}`);

    const res = await axios.get("http://localhost:3000/cars");
    setCar(res.data);
  } catch (err) {
    console.log(err);
  }
};
 
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">CAR MODELS</h1>

        {/* Add Car FORM */}
        <div className="bg-white p-4 rounded shadow mb-6 flex gap-2 flex-wrap">
          <input
            name="model_name"
            value={form.model_name}
            onChange={handleChange}
            placeholder="Model Name"
            className="border p-2 rounded"
          />
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company"
            className="border p-2 rounded"
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 rounded"
          />
          <input
            name="engine_type"
            value={form.engine_type}
            onChange={handleChange}
            placeholder="Engine Type"
            className="border p-2 rounded"
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={addCar}
          >
            Add Car
          </button>
        </div>

        {/* Display Car details */}
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Model</th>
              <th className="p-2">Company</th>
              <th className="p-2">Price</th>
              <th className="p-2">Engine</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {car.map((car) => (
              <tr
                key={car.model_id}
                className="border-t hover:bg-gray-50 text-center"
              >
                <td className="p-2">{car.model_name}</td>
                <td className="p-2">{car.company}</td>
                <td className="p-2">{car.price}</td>
                <td className="p-2">{car.engine_type}</td>

                <td className="p-2">
                  <button
                    onClick={() => {
                      setForm(car);
                      setEdit_id(car.model_id);
                      setShowEform(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCar(car.model_id)}
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
            <h2 className="text-lg font-bold mb-4">Edit Car</h2>

            <input
              name="model_name"
              value={form.model_name}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              name="engine_type"
              value={form.engine_type}
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
                onClick={addCar}
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

export default Cars;
