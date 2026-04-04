import { useState, useEffect } from "react";
import api from "../../api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    name: "",
    role: "",
    factory_id: "",
  });

  const [edit_id, setEdit_id] = useState(null);

  // LOAD EMPLOYEES
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "factory_id" ? Number(value) : value,
    });
  };

  // ADD / UPDATE
  const handleSubmit = async () => {
    try {
      if (edit_id) {
        await api.put(`/employees/${edit_id}`, form);
        setEdit_id(null);
      } else {
        await api.post("/employees", form);
      }

      setForm({
        name: "",
        role: "",
        factory_id: "",
      });

      loadEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      loadEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-4">EMPLOYEES</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3">
        <input
          name="name"
          placeholder="Enter Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="factory_id"
          placeholder="Factory ID"
          value={form.factory_id}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
        >
          {edit_id ? "Update Employee" : "Add Employee"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Employee Name</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Factory Location</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((e) => (
              <tr key={e.employee_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{e.name}</td>
                <td className="p-3">{e.role}</td>

                <td className="p-3">
                  {e.factory_location} (ID: {e.factory_id})
                </td>

                <td className="p-3 text-center space-x-2">
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setForm({
                        name: e.name,
                        role: e.role,
                        factory_id: e.factory_id,
                      });
                      setEdit_id(e.employee_id);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(e.employee_id)}
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
  );
};

export default Employees;