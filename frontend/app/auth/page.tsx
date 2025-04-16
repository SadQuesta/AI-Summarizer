"use client";

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function AuthPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginId, setLoginId] = useState(""); // user name or mail for login
    const [username, setUsername] = useState(""); // User name  for register
    const [email, setEmail] = useState(""); // Email  for register
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); //Password confirmation for register
    
    const auth = useContext(AuthContext); //take auth with useContext 
    if (!auth) {
        // If AuthContext is null, pushes the user to the loading page before the page loads
        return <div>Loading...</div>;
    }
    
    const { login, register, error } = auth;  

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isRegistering) {
            if (password !== confirmPassword) {
                alert("Şifreler uyuşmuyor!");
                return;
            }
            const success = await register(username, email, password);
            if (success) {
                setIsRegistering(false); 
            }
        } else {
            await login(loginId, password);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                {isRegistering ? "Kayıt Ol" : "Giriş Yap"}
            </h2>

            {error && <p className="text-red-500">{error}</p>}

            <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                {isRegistering ? (
                    <>
                        <input
                            type="text"
                            placeholder="User Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                        />
                    </>
                ) : (
                    <input
                        type="text"
                        placeholder="Username or E-mail"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        required
                        className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                    />
                )}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                />

                {isRegistering && (
                    <input
                        type="password"
                        placeholder="Write password again"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                    />
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                >
                    {isRegistering ? "Register" : "Login"}
                </button>
            </form>

            {/* 🔁 Giriş / Kayıt arası geçiş */}
            <p className="mt-4 text-center">
                {isRegistering
                    ? "Do you already have an account?"
                    : "Don't have an account?"}{" "}
                <a
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-blue-500 cursor-pointer"
                >
                    {isRegistering ? "Login" : "Register"}
                </a>
            </p>
        </div>
    );
}
