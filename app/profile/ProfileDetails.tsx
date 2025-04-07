"use client";
import { useState, useContext } from "react";
import ProfileImageUpload from "./ProfileImageUpdate";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";
import { generateBanner } from "@/lib/api";

export default function ProfileDetails({ user, logout }) {
    const defaultBanner = "https://source.unsplash.com/1600x400/?nature,technology";
    const defaultProfile = "https://i0.wp.com/florrycreativecare.com/wp-content/uploads/2020/08/blank-profile-picture-mystery-man-avatar-973460.jpg?ssl=1";

    const router = useRouter();
    const { token } = useContext(AuthContext);

    const [profilePhoto, setProfilePhoto] = useState(user?.profile_picture || defaultProfile);
    const [bannerPhoto, setBannerPhoto] = useState(user?.banner_url || defaultBanner);

    const handleLogout = async () => {
        await logout();
        router.push("/auth");
    };

    const handleBannerChange = async () => {
        try {
            const data = await generateBanner(token);
            setBannerPhoto(data.banner_url);
        } catch (err) {
            console.error("Banner oluşturulamadı:", err);
        }
    };
    

    return (
        <div>
            {/* Banner */} 
            <div className="rounded-t-lg h-60 overflow-hidden relative">
                <img src={bannerPhoto} alt="Banner" className="w-full h-full object-cover" />
                <button
                    onClick={handleBannerChange}
                    className="absolute bottom-2 right-2 bg-white bg-opacity-75 p-2 rounded cursor-pointer"
                >
                    Banner Değiştir
                </button>
            </div>

            {/* Profil Fotoğrafı */}
            <div className="w-60 h-60 border-4 border-white rounded-full overflow-hidden mx-auto -mt-32 relative z-10 shadow-lg">
                <img src={profilePhoto} alt="Profile" className="object-cover h-full w-full" />
            </div>

            <ProfileImageUpload setProfilePhoto={setProfilePhoto} />

            <div className="text-center mt-4">
                <h1 className="text-2xl font-bold text-sky-800">{user?.username || "Kullanıcı"}</h1>
                <p className="text-gray-500">{user?.email || "Mail bulunamadı"}</p>
                <p className="text-gray-500">{user?.role || "Kullanıcı"}</p>
                <button
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={handleLogout}
                >
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
}
