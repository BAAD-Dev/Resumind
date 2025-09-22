"use client";

import Link from "next/link";
import { useState } from "react";

export default function MyResumePage() {
  const [user] = useState({
    name: "Gabriela Vania",
  });

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Resume Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Upload CV section */}
        <div className="bg-white shadow rounded-xl p-6 flex items-center gap-6">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition">
            Upload CV
          </button>
          <p className="text-gray-600">
            Deskripsi singkat tentang resume kamu. Misalnya: ini adalah resume
            yang berisi personal information, education, dan work experience.
          </p>
        </div>

        {/* Resume Sections */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">My Resume</h2>

          <div className="space-y-4">
            <section className="p-4 border rounded-md">
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <p className="text-gray-600 text-sm">Nama, kontak, alamat…</p>
            </section>

            <section className="p-4 border rounded-md">
              <h3 className="font-semibold mb-2">Education</h3>
              <p className="text-gray-600 text-sm">
                Riwayat pendidikan kamu ditampilkan di sini.
              </p>
            </section>

            <section className="p-4 border rounded-md">
              <h3 className="font-semibold mb-2">Work Experience</h3>
              <p className="text-gray-600 text-sm">
                Pengalaman kerja kamu akan muncul di sini.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
