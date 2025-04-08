"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/context/AuthContext";

export const useRequireToken = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // 🔐 sadece tarayıcıda çalışsın
    if (!authContext) return;
    if (!authContext.token) {
      router.push("/auth"); // client-side yönlendirme
    } else {
      setToken(authContext.token);
    }
  }, [authContext, router]);

  return token;
};
