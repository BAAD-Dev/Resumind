"use client";
import React from "react";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1>
        <p className="text-gray-600 mt-2">
          Upload your existing resume or build a new one by entering your
          information below. Our AI will turn your details into a polished,
          professional document to support your career journey.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
            Upload Resume
          </button>
          {/* <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
            Download PDF
          </button> */}
        </div>
      </div>

      {/* Personal Information Section
      <div className="mt-8 bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Location
            </label>
            <input
              type="text"
              placeholder="City, Country"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone
            </label>
            <input
              type="text"
              placeholder="+62 ..."
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}
