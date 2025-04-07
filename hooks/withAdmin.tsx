"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "./useAuth";

const withAdmin = (WrappedComponent: React.FC) => {
    return (props: any) => {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && (!user || user.role !== "admin")) {
                router.push("/");
            }
        }, [loading, user, router]);

        if (loading) return <p>Yükleniyor...</p>;
        if (!user || user.role !== "admin") return null;

        return <WrappedComponent {...props} />;
    };
};

export default withAdmin;
