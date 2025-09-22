"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user] = useState({ name: "Nama User" });

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 text-xl font-bold border-b">Resumind</div>
          <nav className="mt-6 space-y-2">
            <Link
              href="/dashboard"
              className={`block px-6 py-2 rounded-md ${
                pathname === "/dashboard"
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-900"
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard/profile"
              className={`block px-6 py-2 rounded-md ${
                pathname === "/dashboard/profile"
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-900"
              }`}
            >
              Profile
            </Link>
            <Link
              href="/dashboard/my-resume"
              className={`block px-6 py-2 rounded-md ${
                pathname === "/dashboard/my-resume"
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-900"
              }`}
            >
              My Resume
            </Link>
            <Link
              href="/dashboard/job-matcher"
              className="block px-6 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-900 rounded-md"
            >
              Job Matcher
            </Link>
          </nav>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 px-6 py-4 border-t">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            👤
          </div>
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition">
              Premium
            </button>

            {/* Logout icon */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 
                  005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 
                  002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
