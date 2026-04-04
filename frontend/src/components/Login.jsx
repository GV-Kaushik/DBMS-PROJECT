import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate=useNavigate();
const handleLogin = async () => {
  if (!email || !password) {
    setError("All fields are required");
    return;
  }

  try {
    console.log("Sending:", email, password); 

    const res = await axios.post("http://localhost:3000/login", {
      email,
      password,
    });

    console.log("Response:", res.data); 

    const { token, role } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    if (role === "admin") navigate("/admin");
    else if (role === "design") navigate("/design");
    else if (role === "production") navigate("/production");
    else if (role === "sales") navigate("/sales");

    setError("");
    alert("Login successful");

  } catch (err) {
    console.log("ERROR FULL:", err); 
    console.log("ERROR RESPONSE:", err?.response); 
    setError("Invalid credentials");
  }
};
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Car Manufacturing System
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
