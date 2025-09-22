import React from "react";

export default function ResumePage() {
  return (
    <>
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Provide your information or upload your resume, and our AI will
            produce a polished, professional document to support your career
            journey.
          </h1>
        </div>
      </div>

      {/* <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">History Matching</h2>
        <p className="text-gray-500 text-sm">
          Belum ada history. Nanti hasil matching antara profile & job
          description akan tampil di sini.
        </p>
      </div> */}
    </>
  );
}
