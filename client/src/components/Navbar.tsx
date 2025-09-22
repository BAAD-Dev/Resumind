"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogoutHandler } from "./Logout";

type NavbarProps = {
  isLoggedIn: boolean;
};

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-trans.png"
                alt="Resumind Logo"
                width={150}
                height={40}
                className="w-auto h-50"
                priority
              />
            </Link>
          </div>

          {/* Menu tengah */}
          <div className="hidden md:flex flex-grow justify-center items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-blue-800">
              Home
            </Link>
            <Link href="/#about" className="text-gray-600 hover:text-blue-800">
              About
            </Link>
            <Link href="/#price" className="text-gray-600 hover:text-blue-800">
              Price
            </Link>
            <Link
              href="/contacts"
              className="text-gray-600 hover:text-blue-800">
              Contacts
            </Link>
          </div>

          {/* Menu kanan */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && (
              <Link
                href="/myresume"
                className="text-gray-600 hover:text-blue-800">
                My Resume
              </Link>
            )}

            {isLoggedIn && (
              <Link
                href="/payment"
                className="text-gray-600 hover:text-blue-800">
                Plan
              </Link>
            )}

            {isLoggedIn ? (
              <form action={LogoutHandler}>
                <button
                  type="submit"
                  className=" cursor-pointer p-2 rounded-full hover:bg-gray-100 transition"
                  title="Logout">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-600">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 
                  005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 
                  002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100">
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
