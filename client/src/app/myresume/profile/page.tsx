"use server";

import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStorage = await cookies();
  const tokenCookie = cookieStorage.get("token");
  const token = tokenCookie?.value;

  if (!token) {
    return (
      <div className="p-6">
        <p>
          Please{" "}
          <a href="/login" className="text-blue-600 underline">
            login
          </a>
          .
        </p>
      </div>
    );
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/userLogin`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("Failed fetch user", await response.text());
    return <div className="p-6">No User</div>;
  }

  const data = await response.json();
  const user = data.dataUser;

  function formatJoinedDate(createdAt: string) {
    const date = new Date(createdAt);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date);
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl p-10 flex items-start gap-10">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-semibold text-gray-600">
                {userInitial}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              {/* Basic Info */}
              <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 mt-3 font-base">{user?.email}</p>

              {/* Divider */}
              <div className="border-t mt-6 pt-6 grid grid-cols-2 gap-6">
                {/* Plan */}
                <div>
                  <span className="text-sm mx-1.5 text-gray-500 block">
                    Plan
                  </span>
                  <span
                    className={`inline-block mt-2 px-4 py-1 text-sm font-semibold rounded-full ${
                      user?.role === "FREE"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}>
                    {user?.role}
                  </span>
                </div>

                {/* Joined */}
                <div>
                  <span className="text-sm text-gray-500 block">Joined</span>
                  <span className="mt-2 block font-medium text-gray-800">
                    {user?.createdAt ? formatJoinedDate(user.createdAt) : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
