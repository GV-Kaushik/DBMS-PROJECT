import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import api from "../../api";

const Dealers = () => {
  const [dealers,setDealers]=useState([]);

  const [form,setForm] = useState({
    dealer_name:"",
    city:"",
    contact:"",
  });

  const [edit_id,setEdit_id] = useState(null);

  useEffect(()=>{
    loadDealers();
  },[]);

  const loadDealers = async()=>{
    try{
      const res= await api.get("/dealers");
      setDealers(res.data);
    }catch(err){
      console.log(err);
    }
  };

  const handleChange = (e)=>{
    const {name,value} = e.target;

    setForm({
      ...form,
      [name]:value,
    });
  };

  const handleSubmit = async()=>{
    try{
      if(edit_id){
        await api.put(`/dealers/${edit_id}`,form);
        setEdit_id(null);
      }else{
        await api.post("/dealers",form);
      }

      setForm({
        dealer_name:"",
        city:"",
        contact:"",
      });
      loadDealers();
    }catch(err){
      console.log(err);
    }
  }

  const handleDelete= async(id)=>{
    try{
      await api.delete(`/dealers/${id}`);
      loadDealers();
    }catch(err){
      console.log(err);
    }
  }


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">DEALERS</h1>
       <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3">
        <input 
        name='dealer_name'
        placeholder='ENTER NAME'
        value={form.dealer_name}
        onChange={handleChange}
        className="border p-2 rounded w-full" />

        <input 
        name='city'
        placeholder='CITY'
        value={form.city}
        onChange={handleChange}
        className="border p-2 rounded w-full" />

        <input 
        name='contact'
        placeholder='CONTACT'
        value={form.contact}
        onChange={handleChange}
        className="border p-2 rounded w-full" />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
        >
          {edit_id ? "Update Dealer" : "Add Dealer"}
        </button>
       </div>

       <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Dealer Name</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {dealers.map((d) => (
              <tr key={d.dealer_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{d.dealer_name}</td>
                <td className="p-3">{d.city}</td>

                <td className="p-3">
                  {d.contact}
                </td>

                <td className="p-3 text-center space-x-2">
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setForm({
                        dealer_name: d.dealer_name,
                        city: d.city,
                        contact: d.contact,
                      });
                      setEdit_id(d.dealer_id);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(d.dealer_id)}
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

export default Dealers