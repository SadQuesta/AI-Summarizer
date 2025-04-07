"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, loginUser, registerUser, getSummaries, toggleFavoriteSummary } from "@/lib/api";
import { deleteSummary } from "@/lib/api";
import { uploadProfilePicture } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState(null);
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();



    const deleteSummaryById = async (id: number) => {
        if (!token) return;
        try {
            await deleteSummary(id, token);
            // Silme sonrası local state’ten de kaldır
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
            setUser((prev) => ({ ...prev, profile_picture: newUrl }));

            // localStorage da güncel olsun
            const updatedUser = { ...user, profile_picture: newUrl };
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) {
            console.error("Fotoğraf yükleme hatası:", err);
        }
    };




    // İlk açılışta token'ı kontrol et
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
    
        if (storedToken) {
            setToken(storedToken);
    
            // Token varsa direkt fetchProfile çağır
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
    
    

    // Kullanıcı bilgilerini al + özetleri çek
    const fetchProfile = async (accessToken: string) => {
        try {
            setLoading(true);
            const userData = await getUserProfile(accessToken);
            const summaryData = await getSummaries(accessToken);

            setUser(userData);
            setSummaries(summaryData.summaries || []);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (err) {
            logout(); // Token bozuksa çıkış
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
            setSummaries((prev) => prev.map((s) => (s.id === id ? { ...s, is_favorite: res.is_favorite } : s))
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
        <AuthContext.Provider value={{ user, token, summaries, loading, error, login, register, logout, deleteSummary: deleteSummaryById,toggleFavorite, updateProfilePicture }}>
            {children}
        </AuthContext.Provider>
    );
};



export default AuthContext;
