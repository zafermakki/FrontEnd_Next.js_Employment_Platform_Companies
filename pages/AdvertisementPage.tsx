"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface JobFormData {
  title: string;
  job_type: "job" | "internship";
  description: string;
  location: string;
  salary: string;
  requirements: string;
  deadline: string;
  company_id: string;
}

interface Company {
  id: number;
  name: string;
}

export default function AdvertisementPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    job_type: "job",
    description: "",
    location: "",
    salary: "",
    requirements: "",
    deadline: "",
    company_id: "", // ✅
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/api/companies/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        }
      } catch (err) {
        console.error("Failed to fetch companies", err);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "Please log in first", "error");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/jobads/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire("Success", "Advertisement posted successfully ✅", "success");
        setFormData({
          title: "",
          job_type: "job",
          description: "",
          location: "",
          salary: "",
          requirements: "",
          deadline: "",
          company_id: "",
        });
      } else {
        const data = await response.json();
        Swal.fire("Error", data.detail || "An error occurred", "error");
      }
    } catch {
      Swal.fire("Error", "Failed to connect to the server", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-blue-200">
      <h3 className="text-3xl font-bold text-blue-700 mb-6">Post a New Advertisement</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
      <select
          name="company_id"
          value={formData.company_id}
          onChange={handleChange}
          required
          className="w-full border border-blue-300 rounded-lg p-2"
        >
          <option value="">Select a Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Advertisement Title"
          className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <select
          name="job_type"
          value={formData.job_type}
          onChange={handleChange}
          className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="job">Job</option>
          <option value="internship">Internship</option>
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border border-blue-300 rounded-lg p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary (optional)"
          className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="Requirements"
          className="w-full border border-blue-300 rounded-lg p-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Post Advertisement
        </button>
      </form>
    </div>
  );
}