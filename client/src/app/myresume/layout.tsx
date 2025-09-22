import NavbarServer from "@/components/NavbarServer";
import Link from "next/link";
import React from "react";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarServer />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
          <div>
            <nav className="mt-6 space-y-2">
              <Link
                href="/myresume/profile"
                className={`block px-6 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-900 rounded-md`}>
                Profile
              </Link>
              <Link
                href="/myresume/resume"
                className={`block px-6 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-900 rounded-md`}>
                Resume
              </Link>
              <Link
                href="/myresume/job-matcher"
                className="block px-6 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-900 rounded-md">
                Job Matcher
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </>
  );
}
