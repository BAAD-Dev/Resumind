"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { logoutHandler } from "./logout";

type NavbarProps = {
  isLoggedIn: boolean;
  userName?: string;
  role?: string;
};

export default function Navbar({ isLoggedIn, userName, role }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center cursor-pointer"
              onClick={handleLinkClick}
            >
              <Image
                src="/logo_new.png"
                alt="Resumind Logo"
                width={150}
                height={40}
                className="w-auto h-15"
                priority
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex flex-grow font-semibold justify-center items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-blue-900">
              Home
            </Link>
            <Link href="/#about" className="text-gray-600 hover:text-blue-900">
              About
            </Link>
            <Link href="/#price" className="text-gray-600 hover:text-blue-900">
              Price
            </Link>
            <Link href="/#footer" className="text-gray-600 hover:text-blue-900">
              Contacts
            </Link>
          </div>

          {/* Desktop kanan */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/myresume"
                  className="text-gray-600 hover:text-blue-800"
                >
                  My Resume
                </Link>
                {role === "FREE" && (
                  <Link
                    href="/payment"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full shadow-sm transition"
                  >
                    Upgrade Plan
                  </Link>
                )}
                <div className="border-l border-gray-300 h-7"></div>
                {userName && (
                  <span className="text-gray-700 font-medium capitalize">
                    Hi, {userName}
                  </span>
                )}
                <form action={logoutHandler}>
                  <button
                    type="submit"
                    className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition"
                    title="Logout"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                      />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="-mr-2 flex md:hidden cursor-pointer">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg cursor-pointer border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col font-semibold">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-900 py-2 px-3 rounded"
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="text-gray-600 hover:text-blue-900 py-2 px-3 rounded"
              onClick={handleLinkClick}
            >
              About
            </Link>
            <Link
              href="/#price"
              className="text-gray-600 hover:text-blue-900 py-2 px-3 rounded"
              onClick={handleLinkClick}
            >
              Price
            </Link>
            <Link
              href="/#footer"
              className="text-gray-600 hover:text-blue-900 py-2 px-3 rounded"
              onClick={handleLinkClick}
            >
              Contacts
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/myresume"
                  className="text-gray-600 hover:text-blue-800 py-2 px-3 rounded"
                  onClick={handleLinkClick}
                >
                  My Resume
                </Link>
                {role === "FREE" && (
                  <Link
                    href="/payment"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full shadow-sm transition mb-2"
                    onClick={handleLinkClick}
                  >
                    Upgrade Plan
                  </Link>
                )}
                {userName && (
                  <span className="block text-gray-700 font-medium capitalize px-3 py-1">
                    Hi, {userName}
                  </span>
                )}

                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await logoutHandler();
                  }}
                  type="submit"
                  className="w-full text-left py-2 px-3 rounded cursor-pointer hover:bg-gray-100 transition"
                  title="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg"
                onClick={handleLinkClick}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
