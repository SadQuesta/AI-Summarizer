"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import AuthContext from "@/app/context/AuthContext";

export default function Navbar() {
  const authContext = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!authContext) return null; // Context yoksa boş render

  const { user, logout } = authContext;

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const defaultAvatar =
    "https://i0.wp.com/florrycreativecare.com/wp-content/uploads/2020/08/blank-profile-picture-mystery-man-avatar-973460.jpg?ssl=1";

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
  };

  return (
    <nav className="bg-sky-700 text-white py-4 px-6 rounded-lg shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo & Title */}
        <div className="flex items-center space-x-2">
          <img src="/Summarizer.png" className="w-60 h-20 object-cover select-none" alt="Logo" />
          
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link className="hover:text-yellow-300" href="/">Home</Link>
          <Link className="hover:text-yellow-300" href="/summarize">Summarizer</Link>
          <Link className="hover:text-yellow-300" href="/contact">Contact</Link>

          {!user ? (
            <Link className="hover:text-yellow-300" href="/auth">Sign in & Sign Up</Link>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/profile" className="flex items-center space-x-2 hover:text-yellow-300">
                <img
                  src={user.profile_picture || defaultAvatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <span>{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-300 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white text-2xl focus:outline-none">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 animate-slide-down">
          <div className="flex flex-col space-y-2">
            <Link className="block p-2 hover:bg-blue-700 rounded" href="/" onClick={toggleMobileMenu}>Home</Link>
            <Link className="block p-2 hover:bg-blue-700 rounded" href="/summarize" onClick={toggleMobileMenu}>Summarizer</Link>
            <Link className="block p-2 hover:bg-blue-700 rounded" href="/contact" onClick={toggleMobileMenu}>Contact</Link>

            {!user ? (
              <Link className="block p-2 hover:bg-blue-700 rounded" href="/auth" onClick={toggleMobileMenu}>Sign in</Link>
            ) : (
              <>
                <Link className="block p-2 hover:bg-blue-700 rounded" href="/profile" onClick={toggleMobileMenu}>Profile</Link>
                <button
                  onClick={handleLogout}
                  className="block text-left p-2 hover:bg-blue-700 text-red-300 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
