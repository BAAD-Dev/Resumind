import NavbarServer from "@/components/NavbarServer";
import Link from "next/link";
import React from "react";
import { User, FileText, Briefcase, Route } from "lucide-react";
import { ToastContainer } from "react-toastify";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <NavbarServer />
      </div>

      <div className="flex">
        <aside className="sticky top-20 w-64 h-[calc(100vh-5rem)] bg-[#162B60] shadow-md flex flex-col">
          <nav className="mt-6 space-y-1">
            <Link
              href="/myresume/profile"
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-gray-50 hover:text-blue-900 rounded-md transition"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>

            <Link
              href="/myresume"
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-gray-50 hover:text-blue-900 rounded-md transition"
            >
              <Route className="w-5 h-5" />
              <span>Journey</span>
            </Link>

            <Link
              href="/myresume/resume"
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-gray-50 hover:text-blue-900 rounded-md transition"
            >
              <FileText className="w-5 h-5" />
              <span>Resume</span>
            </Link>

            <Link
              href="/myresume/job-matcher"
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-gray-50 hover:text-blue-900 rounded-md transition"
            >
              <Briefcase className="w-5 h-5" />
              <span>Job Matcher</span>
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
