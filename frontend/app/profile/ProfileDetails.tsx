"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@context/AuthContext";
import { generateBanner } from "@/lib/api";
import ProfileImageUpload from "./ProfileImageUpdate";
import { UserType } from "../types/types"; // tip varsa bunu kullan

type Props = {
  user: UserType;
  logout: () => Promise<void>;
};

export default function ProfileDetails({ user, logout }: Props) {
  
  const defaultProfile =
    "https://i0.wp.com/florrycreativecare.com/wp-content/uploads/2020/08/blank-profile-picture-mystery-man-avatar-973460.jpg?ssl=1";

  const router = useRouter();
  const { requireToken } = useContext(AuthContext)!;

  const [profilePhoto, setProfilePhoto] = useState(user.profile_picture || defaultProfile);
  

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

 

  return (
    <div>
     
      <div className="w-60 h-60 border-5 border-white rounded-full overflow-hidden mx-auto -mt-3 relative z-10 shadow-lg">
        <img
          src={profilePhoto}
          alt="Profile"
          className="object-cover h-full w-full"
        />
      </div>

      {/* Profil Fotoğrafı Yükleme */}
      <ProfileImageUpload setProfilePhoto={setProfilePhoto} />

      {/* Kullanıcı Bilgileri */}
      <div className="text-center mt-4">
        <h1 className="text-2xl font-bold text-sky-800">{user.username}</h1>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-gray-500">{user.role || "Kullanıcı"}</p>
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
