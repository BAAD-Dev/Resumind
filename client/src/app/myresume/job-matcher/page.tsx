export default function JobMatcherPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Evaluate with Job Posting */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Evaluate with Job Posting
          </h2>
          <textarea
            rows={4}
            placeholder="Copas job description dari portal lowongan di sini..."
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500"></textarea>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
            Evaluate Job Posting
          </button>
        </div>

        {/* History Matching */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">History Matching</h2>
          <p className="text-gray-500 text-sm">
            Belum ada history. Nanti hasil matching antara profile & job
            description akan tampil di sini.
          </p>
        </div>
      </main>
    </div>
  );
}
