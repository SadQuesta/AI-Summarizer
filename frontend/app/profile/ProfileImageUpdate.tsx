"use client";

import { useState, useContext, ChangeEvent } from "react";
import AuthContext from "../context/AuthContext";

type Props = {
  setProfilePhoto: (imageUrl: string) => void;
};

export default function ProfileImageUpload({ setProfilePhoto }: Props) {
  const [image, setImage] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) return null;
  const { updateProfilePicture } = authContext; // ✅ doğru isim

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setImage(base64Image);
      setProfilePhoto(base64Image);
    };
    reader.readAsDataURL(file);

    try {
      await updateProfilePicture(file); // ✅ context içindeki güncelleyici
    } catch (err) {
      console.error("Profil fotoğrafı yüklenemedi:", err);
    }
  };

  return (
    <div className="text-center mt-4">
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Change Profile Photo
      </label>
    </div>
  );
}
