"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "./useAuth";

const withAuth = (WrappedComponent: React.FC) => {
    return (props: any) => {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push("/login");
            }
        }, [loading, user, router]);

        if (loading) return <p>Yükleniyor...</p>;
        if (!user) return null;

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
