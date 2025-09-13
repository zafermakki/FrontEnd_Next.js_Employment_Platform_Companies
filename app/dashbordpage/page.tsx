"use client";
import { useState } from "react";
import Sidebar from "@/components/dashbord/Sidbar";
import Header from "@/components/dashbord/Header";
import Content from "@/components/dashbord/Content";

const DashboardPage = () => {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false); 

  return (
    <div className="flex h-screen bg-blue-50">
      <div className="hidden md:block">
        <Sidebar active={active} setActive={setActive} />
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="fixed left-0 top-0 h-full w-64 bg-blue-600 z-50">
            <Sidebar active={active} setActive={setActive} closeMenu={() => setIsOpen(false)} />
          </div>
          <div
            className="w-full h-full"
            onClick={() => setIsOpen(false)}
          ></div>
        </div>
      )}

      {/* Main Section */}
      <main className="flex-1 flex flex-col">
        <Header username="Username" onMenuClick={() => setIsOpen(true)} />
        <Content active={active} />
      </main>
    </div>
  );
};

export default DashboardPage;
