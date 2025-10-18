"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface JobAd {
  id: number;
  title: string;
  job_type: "job" | "internship";
  description: string;
  location: string;
  salary: string;
  requirements: string;
  deadline: string;
}

export default function MyAdvertisementsPage() {
  const [ads, setAds] = useState<JobAd[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingAd, setEditingAd] = useState<JobAd | null>(null);

  const [editForm, setEditForm] = useState<JobAd>({
    id: 0,
    title: "",
    job_type: "job",
    description: "",
    location: "",
    salary: "",
    requirements: "",
    deadline: "",
  });

  // Fetch advertisements
  const fetchAds = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/my-Advertisements/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAds(data);
      } else {
        Swal.fire("Error", "Failed to fetch advertisements", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Connection error", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Open edit modal
  const openEditModal = (ad: JobAd) => {
    setEditingAd(ad);
    setEditForm(ad);
  };

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Save edits
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token || !editingAd) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/my-Advertisements/edit/delete/${editingAd.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        Swal.fire("Success!", "Advertisement updated successfully.", "success");
        setAds((prev) =>
          prev.map((ad) => (ad.id === editingAd.id ? { ...ad, ...editForm } : ad))
        );
        setEditingAd(null);
      } else {
        Swal.fire("Error", "Failed to update advertisement", "error");
      }
    } catch {
      Swal.fire("Error", "Could not connect to the server", "error");
    }
  };

  // Delete advertisement
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This advertisement will be permanently deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/my-Advertisements/edit/delete/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          Swal.fire("Deleted!", "Advertisement has been deleted.", "success");
          setAds((prev) => prev.filter((ad) => ad.id !== id));
        } else {
          Swal.fire("Error", "Failed to delete advertisement", "error");
        }
      } catch {
        Swal.fire("Error", "Could not connect to the server", "error");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md border border-blue-200">
      <h3 className="text-3xl font-bold text-blue-700 mb-6">My Advertisements</h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : ads.length === 0 ? (
        <p className="text-gray-500">You have not posted any advertisements yet.</p>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="border border-blue-300 rounded-lg p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center"
            >
              <div className="flex-1">
                <h4 className="text-xl font-bold text-blue-700">{ad.title}</h4>
                <p className="text-gray-700">{ad.description}</p>
                <p className="text-gray-500 text-sm">
                  {ad.job_type} | {ad.location} | {ad.salary ? `$${ad.salary}` : "Not specified"} | {ad.deadline}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex gap-2">
                <button
                  onClick={() => openEditModal(ad)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingAd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Edit Advertisement</h3>

            <div className="space-y-3">
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full border border-blue-300 rounded-lg p-2"
              />
              <select
                name="job_type"
                value={editForm.job_type}
                onChange={handleChange}
                className="w-full border border-blue-300 rounded-lg p-2"
              >
                <option value="job">Job</option>
                <option value="internship">Internship</option>
              </select>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border border-blue-300 rounded-lg p-2 h-24"
              />
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full border border-blue-300 rounded-lg p-2"
              />
              <input
                type="number"
                name="salary"
                value={editForm.salary}
                onChange={handleChange}
                placeholder="Salary"
                className="w-full border border-blue-300 rounded-lg p-2"
              />
              <textarea
                name="requirements"
                value={editForm.requirements}
                onChange={handleChange}
                placeholder="Requirements"
                className="w-full border border-blue-300 rounded-lg p-2 h-20"
              />
              <input
                type="date"
                name="deadline"
                value={editForm.deadline}
                onChange={handleChange}
                className="w-full border border-blue-300 rounded-lg p-2"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingAd(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
