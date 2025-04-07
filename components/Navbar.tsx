"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import AuthContext from "@/app/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false); // 👈 toggle için state

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <nav className="bg-blue-800 text-white py-4 px-6 rounded-lg shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <img src="/favicon.ico" className="w-12 h-12 object-cover select-none" alt="Logo" />
          <h1 className="text-xl font-bold select-none">AI Summarizer</h1>
        </div>

        {/* Links for larger screens */}
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
                  src={user.profile_picture || "/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <span>{user.username}</span>
              </Link>
              <button onClick={logout} className="text-sm text-red-300 hover:text-red-500">Logout</button>
            </div>
          )}
        </div>

        {/* Mobile menu icon */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white text-2xl focus:outline-none">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      {mobileOpen && (
        <div className="md:hidden mt-2 animate-slide-down">
          <div className="flex flex-col space-y-2">
            <Link className="block p-2 hover:bg-blue-700 rounded" href="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link className="block p-2 hover:bg-blue-700 rounded" href="/summarize" onClick={() => setMobileOpen(false)}>Summarizer</Link>
            <Link className="block p-2 hover:bg-blue-700 rounded" href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>

            {!user ? (
              <Link className="block p-2 hover:bg-blue-700 rounded" href="/auth" onClick={() => setMobileOpen(false)}>Sign in</Link>
            ) : (
              <>
                <Link className="block p-2 hover:bg-blue-700 rounded" href="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
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
