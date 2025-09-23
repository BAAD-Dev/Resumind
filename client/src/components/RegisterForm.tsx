"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormState = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type ApiResp =
  | { message?: string } // success
  | { message?: string; error?: string }; // error shape (jaga-jaga)

function toMessage(err: unknown, fallback = "Terjadi kesalahan") {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement & {
      name: keyof FormState;
    };
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      let data: ApiResp | undefined;
      try {
        data = (await res.json()) as ApiResp;
      } catch {
        data = undefined;
      }

      if (!res.ok) {
        const msg =
          (data?.message || (data as any)?.error) ??
          `Register failed (${res.status})`;
        throw new Error(msg);
      }

      toast.success(data?.message || "Register berhasil. Silakan login.");
      router.push("/login");
    } catch (err: unknown) {
      toast.error(toMessage(err, "Register gagal. Coba lagi."));
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

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
          priority
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

      {/* Form */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[28rem] bg-white rounded-4xl shadow-2xl p-10">
          <h1 className="text-4xl font-semibold mb-8 text-center">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-base">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full mt-3 p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-base mt-4">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full mt-3 p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-base">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full mt-3 p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-base mt-4">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full mt-3 p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 mt-3 text-white py-3 rounded-md shadow hover:bg-[#162B60] transition"
            >
              Sign up
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-800 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
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
