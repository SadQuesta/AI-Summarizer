"use client";

import React, { useEffect, useState, ReactNode ,createContext} from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, loginUser, registerUser, getSummaries, toggleFavoriteSummary, uploadProfilePicture, deleteSummary } from "@/lib/api";

export type UserType = {
  id: number;
  username: string;
  email: string;
  role?: string;
  profile_picture?: string;
};

export type SummaryType = {
  id: number;
  content: string;
  is_favorite?: boolean;
};

export type AuthContextType = {
  user: UserType | null;
  token: string | null;
  summaries: SummaryType[];
  loading: boolean;
  error: string | null;
  login: (idOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  deleteSummary: (id: number) => void;
  toggleFavorite: (id: number) => void;
  updateProfilePicture: (file: File) => void;
};

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

  const deleteSummaryById = async (id: number) => {
    if (!token) return;
    try {
      await deleteSummary(id, token);
      setSummaries((prev) => prev.filter((summary) => summary.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const updateProfilePicture = async (file: File) => {
    if (!token) return;
    try {
      const res = await uploadProfilePicture(file, token);
      const newUrl = res.image_url;
  
      // Kullanıcı bilgilerini güncelle
      setUser((prev) => {
        if (prev) {
          // Kullanıcı varsa, profile_picture'ı güncelle
          return { ...prev, profile_picture: newUrl };
        } else {
          // Kullanıcı yoksa (null ise) boş bir UserType objesi oluştur
          return { profile_picture: newUrl, id: 0, username: "", email: "" };
        }
      });
  
      // localStorage'da güncel olsun
      const updatedUser = { ...user, profile_picture: newUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Fotoğraf yükleme hatası:", err);
    }
  };
  
  

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

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await registerUser(username, email, password);
      return res.message ? true : false;
    } catch (err) {
      return false;
    }
  };

  const toggleFavorite = async (id: number) => {
    try {
      const res = await toggleFavoriteSummary(id, token);
      setSummaries((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_favorite: res.is_favorite } : s))
      );
    } catch (err) {
      console.error("Favori güncellenemedi:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setSummaries([]);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, token, summaries, loading, error, login, register, logout, deleteSummary: deleteSummaryById, toggleFavorite, updateProfilePicture }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
