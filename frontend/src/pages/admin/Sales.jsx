import React from 'react'
import { useState,useEffect } from 'react';
import api from "../../api";

const Sales = () => {
  const [sales,setSales]=useState([]);

  const [form,setForm]=useState({
    dealer_id :"",
    model_id :"",
    quantity :"",
    sale_date :"",
  });

  const [edit_id,setEdit_id] = useState(null);

  useEffect(()=>{
    loadSales();
  },[]);

  const loadSales = async ()=>{
    try{
      const res = await api.get("/sales");
      setSales(res.data);
    }catch(err){
      console.log(err);
    }
  };

  const handleChange=(e)=>{
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "dealer_id" ||
        name === "model_id" ||
        name === "quantity"
          ? Number(value)
          : value,
    });
  }

  const handleSubmit = async ()=>{
    try{
      if (edit_id) {
        await api.put(`/sales/${edit_id}`, form);
        setEdit_id(null);
      } else {
        await api.post("/sales", form);
      }

      setForm({
        dealer_id: "",
        model_id: "",
        quantity: "",
        sale_date: "",
      });

      loadSales();
    }catch(err){
      console.log(err);
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/sales/${id}`);
      loadSales();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-4">SALES RECORDS</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3">
        <input
          name="dealer_id"
          placeholder="DEALER"
          value={form.dealer_id}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="model_id"
          placeholder="MODEL"
          value={form.model_id}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="quantity"
          placeholder="QUANTITY"
          value={form.quantity}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="date"
          name="sale_date"
          value={form.sale_date}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
        >
          {edit_id ? "Update Record" : "Add Record"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Dealer </th>
              <th className="p-3 text-left">Model </th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((r) => (
              <tr key={r.sale_id} className="border-t hover:bg-gray-50">
                <td className="p-3"> {r.dealer_name} (ID:{r.dealer_id})</td>
                <td className="p-3">{r.model_name} (ID: {r.model_id})</td>
                <td className="p-3">{r.quantity}</td>
                <td className="p-3">{r.sale_date}</td>

                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => {
                      setForm({
                        dealer_id: r.dealer_id,
                        model_id: r.model_id,
                        quantity: r.quantity,
                        sale_date: r.sale_date,
                      });
                      setEdit_id(r.sale_id);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(r.sale_id)}
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
}

export default Sales