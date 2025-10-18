"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface JobApplication {
    id: number;
    job_title: string;
    company_name: string;
    full_name: string;
    email: string;
    cv: string;
    cover_letter: string;
    status: "pending" | "accepted" | "rejected";
    applied_at: string;
  }

const EmploymentRequests = () => {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");
    
            const res = await fetch("http://127.0.0.1:8000/api/applications/", {
              headers: {
                Authorization: `Token ${token}`,
              },
            });
            const data = await res.json();
            console.log("Applications:", data);
            setApplications(data);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
        fetchApplications();
      }, []);
      
const handleStatusChange = async (id: number, status: "accepted" | "rejected") => {
        const confirm = await Swal.fire({
          title: `Are you sure you want to ${status} this application?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
        });
    
        if (!confirm.isConfirmed) return;
    
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://127.0.0.1:8000/api/applications/${id}/status/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ status }),
          });
    
          if (res.ok) {
            const updated = await res.json();
            setApplications((prev) =>
              prev.map((app) => (app.id === id ? { ...app, status: updated.status } : app))
            );
            Swal.fire("Updated!", `Application has been ${status}.`, "success");
          } else {
            Swal.fire("Error", "Failed to update status", "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Something went wrong", "error");
        }
    };
    

    return(
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Employment Requests</h1>
  
        {loading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-600">No applications found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm uppercase tracking-wider">
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Job</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">CV</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Applied At</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-medium">{app.full_name}</td>
                    <td className="p-3">{app.email}</td>
                    <td className="p-3">{app.job_title}</td>
                    <td className="p-3">{app.company_name}</td>
                    <td className="p-3">
                      {app.cv ? (
                        <a
                          href={app.cv} // ✅ استخدم الرابط مباشرة بدون تكرار
                          download
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                          Download CV
                        </a>
                      ) : (
                        <span className="text-gray-400">No CV</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : app.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleStatusChange(app.id, "accepted")}
                        disabled={app.status === "accepted"}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, "rejected")}
                        disabled={app.status === "rejected"}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
}
export default EmploymentRequests;