"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../app/context/AuthContext";

export default function ProtectedRoute({
    children,
    requireAdmin = false,
}: {
    children: React.ReactNode;
    requireAdmin?: boolean;
}) {
    const { token, user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!token) {
                router.push("/auth");
            } else if (requireAdmin && user?.role !== "admin") {
                router.push("/unauthorized"); // yetkisizse buraya yönlenir
            }
        }
    }, [token, user, loading, requireAdmin]);

    if (loading) return <p className="text-center">Yükleniyor...</p>;

    return <>{children}</>;
}
