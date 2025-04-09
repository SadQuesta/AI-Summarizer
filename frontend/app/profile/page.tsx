"use client";

import { JSX, useContext } from "react";
import AuthContext from "../context/AuthContext";
import ProfileDetails from "./ProfileDetails";
import SummaryList from "./SummaryList";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SummaryType } from "../types/types";

const ProfilePage = (): JSX.Element => {
  const authContext = useContext(AuthContext);

  if (!authContext) return <p className="text-center">Yükleniyor...</p>;

  const { user, summaries, logout, loading, error, deleteSummary } = authContext;

  if (loading) return <p className="text-center">Yükleniyor...</p>;
  if (error || !user) return <p className="text-center text-red-500">Kullanıcı bilgisi yüklenemedi.</p>;

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto p-9 bg-white rounded-lg shadow-lg">
        <ProfileDetails user={user} logout={logout} />
        <SummaryList
          summaries={summaries}
          deleteSummary={deleteSummary}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
