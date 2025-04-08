"use client";

import React, { useEffect, useState, ReactNode, createContext } from "react";
import { useRouter } from "next/navigation";
import {
  getUserProfile,
  loginUser,
  registerUser,
  getSummaries,
  uploadProfilePicture,
  deleteSummary,
} from "@/lib/api";
import { SummaryType, UserType, AuthContextType } from "../types/types";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [summaries, setSummaries] = useState<SummaryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // 🗑 Özet Silme
  const deleteSummaryById = async (id: number) => {
    if (!token) return;
    try {
      await deleteSummary(id, token);
      setSummaries((prev) => prev.filter((summary) => summary.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  // 📸 Profil Fotoğrafı Güncelle
  const updateProfilePicture = async (file: File) => {
    if (!token) return;
    try {
      const res = await uploadProfilePicture(file, token);
      const newUrl = res.image_url;

      setUser((prev) => {
        const updated = prev
          ? { ...prev, profile_picture: newUrl }
          : { id: 0, username: "", email: "", profile_picture: newUrl, role: "user", banner_url: "" };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Fotoğraf yükleme hatası:", err);
    }
  };

  // 🔒 Token gerekiyorsa yönlendirme
  const requireToken = (): string => {
    if (!token) {
      router.push("/login");
      throw new Error("Giriş yapılması gerekiyor.");
    }
    return token;
  };

  // 🧠 Profil Verisi Getir
  const fetchProfile = async (accessToken: string) => {
    try {
      setLoading(true);
      const userData = await getUserProfile(accessToken);
      const summaryData = await getSummaries(accessToken);

      setUser(userData);
      setSummaries(summaryData.summaries || []);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Giriş Yap
  const login = async (idOrEmail: string, password: string) => {
    try {
      const res = await loginUser(idOrEmail, password);
      if (res.access_token) {
        setToken(res.access_token);
        localStorage.setItem("token", res.access_token);
        fetchProfile(res.access_token);
        router.push("/profile");
      }
    } catch (err) {
      setError("Giriş başarısız.");
    }
  };

  // 🆕 Kayıt Ol
  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await registerUser(username, email, password);
      return res.message ? true : false;
    } catch (err) {
      return false;
    }
  };

  // 🚪 Oturumu Kapat
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setSummaries([]);
    router.push("/auth");
  };

  // 🔁 İlk Yüklenmede localStorage'dan token/user çek
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("❌ Kullanıcı verisi parse edilemedi:", err);
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        summaries,
        loading,
        error,
        login,
        register,
        logout,
        deleteSummary: deleteSummaryById,
        updateProfilePicture,
        requireToken,
        setSummaries
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
