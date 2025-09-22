"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [user] = useState({
    name: "Test",
    email: "test@mail.com",
    role: "Software Engineer",
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Profile content */}
        <main className="flex-1 p-6 flex justify-center items-start">
          <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg relative">
            {/* Edit Button */}
            <button className="absolute top-4 right-4 text-sm px-3 py-1 border rounded-md hover:bg-gray-100 transition">
              Edit
            </button>

            {/* Profile Picture */}
            <div className="flex justify-center">
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-4xl">
                👤
              </div>
            </div>

            {/* User Info */}
            <div className="mt-6 text-center space-y-2">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-500">{user.role}</p>
            </div>

            {/* Extra Info */}
            <div className="mt-6 border-t pt-6 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-medium">Free Tier</span>
              </div>
              <div className="flex justify-between">
                <span>Joined</span>
                <span className="font-medium">Sep 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
