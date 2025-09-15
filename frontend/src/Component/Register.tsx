import { useState, useEffect } from "react";
import axios from "axios";
import api from "../Api"
// Types
type FormData = {
  username: string;
  password: string;
  role: string;
  teacherId?: string;
};

type Teacher = {
  id: string;
  username: string;
};

type FieldErrors = {
  username?: string[];
  password?: string[];
  role?: string[];
  teacherId?: string[];
};

export default function Register() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
    teacherId: "",
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

 
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/auth/teachers");
        setTeachers(res.data.teachers || res.data); 
        console.log(res);
      } catch (error) {
        console.error("Error fetching teachers");
      }
    };

    fetchTeachers();
  }, []);

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMessage("");
    setErrors({});

    try {
      const response = await api.post("/auth/register", formData);
      setServerMessage(response.data.message || "Registration successful! or Login successful!");
      setFormData({
        username: "",
        password: "",
        role: "",
        teacherId: "",
      });

      localStorage.setItem("token", response.data.token);
  
      // navigate("/dashboard")
      window.location.href = "/dashboard";
      setServerMessage(response.data.message || "Registration successful! or Login successful!");

    } catch (error: any) {
      console.log(error)
      if (error.response?.data?.errors) {

        setErrors(error.response.data.errors);
        setServerMessage(error.response.data.message || "Validation failed");
      } else if (error.response?.data?.message) {
        setServerMessage(error.response.data.message);
      } else {
        setServerMessage("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Username */}
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

        {/* Password */}
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

        {/* Role */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
          )}
        </div>

        {/* Teacher selection (for students) */}
        {formData.role === "student" && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Select Teacher</label>
            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">Select teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.users_id} value={teacher.users_id}>
                  {teacher.username}
                </option>
              ))}
            </select>
            {errors.teacherId && (
              <p className="text-red-500 text-sm mt-1">{errors.teacherId[0]}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          Register
        </button>

        {/* Server Message  */}
        {serverMessage && (
          <p className="text-center mt-4 text-sm text-gray-700">{serverMessage}</p>
        )}
      </form>
    </div>
  );
}
