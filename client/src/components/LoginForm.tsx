"use client";

import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  return (
    <div className="flex min-h-screen relative">
      {/* BG biru */}
      <div className="flex-1 bg-[#162B60]">
        <Image
          src="/illustration1.png"
          alt="scooter"
          width={350}
          height={350}
          className="hidden md:block absolute bottom-9 left-20 max-w-xs lg:max-w-sm"
          priority
        />
        <Image
          src="/resumind-logo.png"
          alt="resumind_logo"
          width={150}
          height={150}
          className="mx-5 mt-6"
        />
      </div>

      {/* BG putih */}
      <div className="flex-1 bg-white relative">
        <Image
          src="/illustration2.png"
          alt="person"
          width={500}
          height={500}
          className="hidden md:block absolute right-10 top-2 max-w-xs lg:max-w-sm"
          priority
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[28rem] bg-white rounded-4xl shadow-2xl p-10">
          <h1 className="text-4xl font-semibold mb-8 text-center">Login</h1>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-base">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full mt-3 p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-base mt-4">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mt-3 p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 mt-3 text-white py-3 rounded-md shadow hover:bg-[#162B60] transition">
              Sign in
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-5">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-800 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
