"use client";

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function AuthPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginId, setLoginId] = useState(""); // Kullanıcı adı veya e-posta
    const [username, setUsername] = useState(""); // Kayıt için kullanıcı adı
    const [email, setEmail] = useState(""); // Kayıt için e-posta
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Kayıt için şifre doğrulama
    
    const auth = useContext(AuthContext); // useContext ile auth'u al
    if (!auth) {
        // Eğer AuthContext null ise, sayfa yüklenmeden önce kullanıcıyı login sayfasına yönlendir
        return <div>Yükleniyor...</div>;
    }
    
    const { login, register, error } = auth;  // Artık auth null değil, güvenle kullanabilirsin.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isRegistering) {
            if (password !== confirmPassword) {
                alert("Şifreler uyuşmuyor!");
                return;
            }
            const success = await register(username, email, password);
            if (success) {
                setIsRegistering(false); // Kayıttan sonra giriş ekranına geç
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
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                        />
                        <input
                            type="email"
                            placeholder="E-posta"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                        />
                    </>
                ) : (
                    <input
                        type="text"
                        placeholder="Kullanıcı Adı veya E-posta"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        required
                        className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                    />
                )}

                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                />

                {isRegistering && (
                    <input
                        type="password"
                        placeholder="Şifreyi Tekrar Girin"
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
                    {isRegistering ? "Kayıt Ol" : "Giriş Yap"}
                </button>
            </form>

            {/* 🔁 Giriş / Kayıt arası geçiş */}
            <p className="mt-4 text-center">
                {isRegistering
                    ? "Zaten bir hesabınız var mı?"
                    : "Hesabınız yok mu?"}{" "}
                <a
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-blue-500 cursor-pointer"
                >
                    {isRegistering ? "Giriş Yap" : "Kayıt Ol"}
                </a>
            </p>
        </div>
    );
}
