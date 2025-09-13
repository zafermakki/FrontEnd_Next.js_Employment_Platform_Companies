'use client';

import { NextPage } from "next";
import RippleGrid from "@/components/ripplegrid/RippleGrid";
import Link from "next/link";


const Home: NextPage = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <RippleGrid
          enableRainbow={false}
          gridColor="#6a5acd"
          rippleIntensity={0.06}
          gridSize={10}
          gridThickness={15}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
          opacity={0.8}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-4 pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Welcome to <span className="text-indigo-400">SITE</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
          Our platform provides you with an easy and professional way to create an account for your company, post job vacancies, and offer practical training for programmers and students.
        </p>

        <div className="flex gap-4">
          <Link href="/createaccount">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-200 pointer-events-auto cursor-pointer">
              Get Started
            </button>
          </Link>
          <Link href="/signin">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-200 pointer-events-auto cursor-pointer">
                SignIn
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
