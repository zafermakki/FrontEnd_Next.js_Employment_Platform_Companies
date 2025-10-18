"use client";

import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import BadgeIcon from '@mui/icons-material/Badge';
import MessageIcon from '@mui/icons-material/Message';

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface SidebarProps {
  active: string;
  setActive: (page: string) => void;
  closeMenu?: () => void;     
}

const navItems = [
  { key: "home", label: "Main Page", icon: <HomeIcon /> },
  { key: "company", label: "Company Information", icon: <BusinessIcon /> },
  { key: "advertisement", label: "Advertisement", icon: <PostAddIcon /> },
  { key: "myadvertisements", label: "My Advertisements", icon: <DynamicFeedIcon /> },
  { key: "employmentrequests", label: "Employment Requests", icon: <BadgeIcon /> },
  { key: "recruitmentletters", label: "Recruitment Letters", icon: <MessageIcon /> },
];

export default function Sidebar({ active, setActive, closeMenu }: SidebarProps) {
  const router = useRouter();
  const handleClick = (key: string) => {
    setActive(key);
    if (closeMenu) closeMenu();       
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/auth/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // لو API عندك يستخدم Bearer استبدل بـ Bearer
          },
        });

        if (!res.ok) {
          throw new Error("Logout failed");
        }

        // امسح التوكن من localStorage
        localStorage.removeItem("token");

        Swal.fire("Logged out!", "You have been logged out.", "success");

        // تحويل لصفحة تسجيل الدخول
        router.push("/signin");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to log out. Please try again.", "error");
      }
    }
  };

  return (
    <aside className="w-64 bg-blue-600 text-white flex flex-col p-5 h-full">
      <h1 className="text-2xl font-bold mb-10">Dashboard</h1>
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleClick(item.key)}
            className={`flex items-center gap-3 p-2 rounded-lg transition ${
              active === item.key ? "bg-blue-800" : "hover:bg-blue-500"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-500 transition"
        >
          <LogoutIcon /> Logout
        </button>
      </nav>
    </aside>
  );
}
