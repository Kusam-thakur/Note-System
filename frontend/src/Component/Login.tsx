import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api.tsx"; // Assuming your axios instance is here
 const BASE_URL = import.meta.env.VITE_BASE_URL;

type LoginData = {
  username: string;
  password: string;
};

type FieldErrors = {
  username?: string[];
  password?: string[];
};

export default function Login() {
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

  
    setFormData((prev) => ({ ...prev, [name]: value }));

    
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMessage("");
    setErrors({}); // Clear previous errors

    try {
      const response = await api.post("/auth/login", formData);
      console.log("response", response)

      localStorage.setItem("token", response.data.token);
      // localStorage.setItem("user_id", response.data.user.id);
      // localStorage.setItem("role", response.data.user.role);
      // localStorage.setItem("username", response.data.user.username);
      // navigate("/dashboard");
      // if (response.data.user.role === "teacher") {
      //   // localStorage.setItem("teacher_id", response.data.user.id);
      //     localStorage.setItem("teacher_id", response.data.user.users_id);
      // }
      window.location.href = "/dashboard";
      setServerMessage(response.data.message || "Login successful!");

    } catch (error: any) {
      console.error("Login error:", error);

    
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        setServerMessage(error.response.data.message); 
      } else if (error.response?.data?.message) {
        setServerMessage(error.response.data.message); 
      } else {
        setServerMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Server Message */}
        {serverMessage && (
          <p className="text-center mt-4 text-sm text-gray-700">{serverMessage}</p>
        )}
      </form>
    </div>
  );
}
