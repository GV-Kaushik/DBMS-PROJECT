import React from 'react'
import { useState,useEffect } from 'react'
import api from "../../api";

const Users = () => {
  const [users,setUsers] = useState([]);

  const [form,setForm] = useState({
    email:"",
    password:"",
    role:"",
    phone_num:"",
    created_date:"",
  });

  const [edit_id,setEdit_id] = useState(null);

  useEffect(()=>{
    loadUsers();
  },[]);

  const loadUsers = async()=>{
    try{
      const res = await api.get("/users");
      setUsers(res.data);
    }catch(err){
      console.log(err);
    }
  };

  const handleChange=(e)=>{
    const {name,value} = e.target;

    setForm({
      ...form,
      [name]:value
    });
  };

  const handleSubmit = async ()=>{
    try{
      if(edit_id){
        await api.put(`/users/${edit_id}`,form);
        setEdit_id(null);
      }else{
        await api.post("/users",form);
      }

      setForm({
        email:"",
        password:"",
        role:"",
        phone_num:"",
        created_date:"",
      });

      loadUsers();
    }catch(err){
      console.log(err);
    }
  };

  const handleDelete = async (id)=>{
    try{
      await api.delete(`/users/${id}`);
      loadUsers();
    }catch(err){
      console.log(err);
    }
  }


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">USERS</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3">
        <input
          name="email"
          placeholder="ENTER EMAIL"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="password"
          placeholder="PASSWORD"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="role"
          placeholder="ROLE"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="phone_num"
          placeholder="PHONE NUMBER"
          value={form.phone_num}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
        type='date'
          name="created_date"
          placeholder="DATE TIME"
          value={form.created_date}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
        >
          {edit_id ? "Update User" : "Add User"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">User Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Date Time</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.phone_num}</td>
                <td className="p-3">
                  {u.created_date}
                </td>
                <td className="p-3 text-center space-x-2">
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setForm({
                        email:u.email,
                        password:"",
                        role:u.role,
                        phone_num:u.phone_num,
                        created_date: u.created_date
                        ? u.created_date.split("T")[0]
                        : "",
                      });
                      setEdit_id(u.user_id);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(u.user_id)}
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
  )
}

export default Users