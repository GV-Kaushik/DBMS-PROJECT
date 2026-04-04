import { useState, useEffect } from "react";
import api from "../../api";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
    phone_num: "",
    created_date: "",
  });

  const [edit_id, setEdit_id] = useState(null);
  const [showEform, setShowEform] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (edit_id) {
      await api.put(`/users/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/users", form);
    }

    setShowEform(false);
    setForm({
      email: "",
      password: "",
      role: "",
      phone_num: "",
      created_date: "",
    });

    loadUsers();
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    loadUsers();
  };

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">USERS</h1>

          <button onClick={()=>setShowEform(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add User
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <table className="w-full bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.user_id} className="border-t text-center">
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.phone_num}</td>
                <td>{u.created_date?.split("T")[0]}</td>

                <td>
                  <button
                    onClick={() => {
                      setForm({
                        ...u,
                        password: "",
                        created_date: u.created_date?.split("T")[0] || "",
                      });
                      setEdit_id(u.user_id);
                      setShowEform(true);
                    }}
                    className="bg-yellow-500 px-2 py-1 text-white mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(u.user_id)}
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
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full mb-2"/>
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-2 w-full mb-2"/>
            <input name="role" value={form.role} onChange={handleChange} placeholder="Role" className="border p-2 w-full mb-2"/>
            <input name="phone_num" value={form.phone_num} onChange={handleChange} placeholder="Phone" className="border p-2 w-full mb-2"/>
            <input type="date" name="created_date" value={form.created_date} onChange={handleChange} className="border p-2 w-full mb-4"/>

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

export default Users;