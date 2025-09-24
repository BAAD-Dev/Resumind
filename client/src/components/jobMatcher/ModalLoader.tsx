"use client";

export default function ModalLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg px-10 py-7 flex flex-col items-center border border-[#162B60]/10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#162B60] mb-4" />
        <div className="font-bold text-[#162B60] text-lg mb-2">
          Your analysis is being processed...
        </div>
        <div className="text-gray-500 text-sm text-center">
          Please wait while we analyze your resume with the selected job posting.
        </div>
      </div>
    </div>
  );
}
