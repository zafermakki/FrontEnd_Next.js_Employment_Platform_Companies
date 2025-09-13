"use client";
import { useEffect, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import DomainIcon from "@mui/icons-material/Domain";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const API_URL = "http://127.0.0.1:8000/api/companies/";

const CompanyPage = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(API_URL, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelect = (company: any) => {
    setSelectedId(company.id);
    setCompanyName(company.name);
    setLocation(company.location);
    setIndustry(company.industry);
    setDescription(company.description);
    setPreviewLogo(company.logo || null);
    setLogo(null);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("No token found");

    const formData = new FormData();
    formData.append("name", companyName);
    formData.append("location", location);
    formData.append("industry", industry);
    formData.append("description", description);
    if (logo) formData.append("logo", logo);

    const url = selectedId ? `${API_URL}${selectedId}/` : `${API_URL}create/`;
    const method = selectedId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      alert("Company saved ✅");

      if (selectedId) {
        setCompanies((prev) =>
          prev.map((c) => (c.id === selectedId ? data : c))
        );
      } else {
        setCompanies((prev) => [...prev, data]);
      }

      setSelectedId(data.id);
      if (data.logo) setPreviewLogo(data.logo);
    } catch (err) {
      console.error(err);
      alert("Error saving company");
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (res.ok) {
        setCompanies((prev) => prev.filter((c) => c.id !== id));
        if (selectedId === id) {
          setSelectedId(null);
          setCompanyName("");
          setLocation("");
          setIndustry("");
          setDescription("");
          setLogo(null);
          setPreviewLogo(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col p-6">
    <h1 className="text-3xl font-bold text-blue-700 mb-6">
      Company Management
    </h1>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">
          Your Companies
        </h2>
        <ul className="space-y-2">
          {companies.map((company) => (
            <li
              key={company.id}
              className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                selectedId === company.id
                  ? "bg-blue-100 border border-blue-400"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(company)}
            >
              <div className="font-bold">{company.name}</div>
              <div className="text-sm text-gray-600">{company.industry}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(company.id);
                }}
                className="text-red-500 text-sm mt-1"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          onClick={() => {
            setSelectedId(null);
            setCompanyName("");
            setLocation("");
            setIndustry("");
            setDescription("");
            setLogo(null);
            setPreviewLogo(null);
          }}
        >
          + Add New Company
        </button>
      </div>

      {/*  Edit */}
      <div className="md:col-span-2 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          {selectedId ? "Edit Company" : "Add Company"}
        </h2>
        <form className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <UploadFileIcon /> Upload Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <BusinessIcon /> Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <LocationOnIcon /> Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <DomainIcon /> Industry
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Software Development"
              className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <DescriptionIcon /> Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-400"
              rows={4}
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {selectedId ? "Update Company" : "Create Company"}
          </button>
        </form>

        <div className="mt-6 text-center">
          {previewLogo ? (
            <img
              src={previewLogo}
              alt="Company Logo"
              className="w-24 h-24 rounded-full object-cover border mb-4 mx-auto"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-3xl font-bold mb-4 mx-auto">
              {companyName ? companyName[0] : "?"}
            </div>
          )}
          <h3 className="text-2xl font-bold">{companyName || "Company"}</h3>
          <p className="text-gray-500">{industry || "Industry"}</p>
          <p className="text-gray-600">{location || "Location"}</p>
          <p className="text-gray-700 mt-2">
            {description || "Company description will appear here."}
          </p>
        </div>
      </div>
    </div>
  </div>
  );
};

export default CompanyPage;
