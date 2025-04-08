"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../app/context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext) return; // context hiç yoksa render etme

    const { token, user, loading } = authContext;

    if (!loading) {
      if (!token) {
        router.push("/auth");
      } else if (requireAdmin && user?.role !== "admin") {
        router.push("/unauthorized");
      }
    }
  }, [authContext, requireAdmin, router]);

  if (!authContext || authContext.loading) {
    return <p className="text-center">Yükleniyor...</p>;
  }

  return <>{children}</>;
}
