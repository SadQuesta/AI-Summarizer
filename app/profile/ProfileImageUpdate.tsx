"use client";

import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function ProfileImageUpload({ setProfilePhoto }) {
    const [image, setImage] = useState(null);
    const { updateProfilePicture } = useContext(AuthContext);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setProfilePhoto(reader.result as string);
            };
            reader.readAsDataURL(file);

            // ✅ Sunucuya gönder
            await updateProfilePicture(file);
        }
    };

    return (
        <div className="text-center mt-4">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="fileInput" />
            <label htmlFor="fileInput" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg">
                Profil Fotoğrafı Değiştir 📷
            </label>
        </div>
    );
}
