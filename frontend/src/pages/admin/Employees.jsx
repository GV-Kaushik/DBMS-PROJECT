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
  const [showEform, setShowEform] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "factory_id" ? Number(value) : value,
    });
  };

  const handleSubmit = async () => {
    if (edit_id) {
      await api.put(`/employees/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/employees", form);
    }

    setShowEform(false);
    setForm({ name: "", role: "", factory_id: "" });
    loadEmployees();
  };

  const handleDelete = async (id) => {
    await api.delete(`/employees/${id}`);
    loadEmployees();
  };

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">EMPLOYEES</h1>

          <button
            onClick={() => setShowEform(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Employee
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        {/* TABLE */}
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Factory</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((e) => (
              <tr key={e.employee_id} className="border-t text-center">
                <td>{e.name}</td>
                <td>{e.role}</td>
                <td>{e.factory_location}</td>

                <td>
                  <button
                    onClick={() => {
                      setForm(e);
                      setEdit_id(e.employee_id);
                      setShowEform(true);
                    }}
                    className="bg-yellow-500 px-2 py-1 text-white mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(e.employee_id)}
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
      {showEform && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 w-full mb-2"/>
            <input name="role" value={form.role} onChange={handleChange} placeholder="Role" className="border p-2 w-full mb-2"/>
            <input name="factory_id" value={form.factory_id} onChange={handleChange} placeholder="Factory ID" className="border p-2 w-full mb-4"/>

            <div className="flex justify-end gap-2">
              <button onClick={()=>setShowEform(false)} className="bg-gray-300 px-3 py-1">Cancel</button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-1">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Employees;