"use client";  // Doğrudan client-side olarak işaretlendi

import { JSX, useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import ProfileDetails from "./ProfileDetails";
import SummaryList from "./SummaryList";
import SummaryModal from "./SummaryModal";
import ProtectedRoute from "@/components/ProtectedRoute";

// useState ve useContext gibi hook'lar bileşenin üst kısmında
const ProfilePage = (): JSX.Element => {
  // Kullanıcı verisi burada her render'da koşulsuz olarak alınıyor
  const authContext = useContext(AuthContext);
  
  // Bu state koşulsuz olarak tanımlanmalı
  const [selectedSummary, setSelectedSummary] = useState<null | string>(null);

  // Eğer authContext null ise kullanıcıya bir loading mesajı göster
  if (!authContext) {
    return <p className="text-center">Yükleniyor...</p>;
  }

  const { user, summaries, logout, loading, error } = authContext;

  if (loading) return <p className="text-center">Yükleniyor...</p>;
  if (error || !user) {
    return <p className="text-center text-red-500">Kullanıcı bilgisi yüklenemedi.</p>;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto p-9 bg-white rounded-lg shadow-lg">
        <ProfileDetails user={user} logout={logout} />
        <SummaryList summaries={summaries} openModal={setSelectedSummary} />
        {selectedSummary && (
          <SummaryModal summary={selectedSummary} closeModal={() => setSelectedSummary(null)} />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
