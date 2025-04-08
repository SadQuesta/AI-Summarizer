"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";

/**
 * Token'ı güvenli şekilde alır. Eğer yoksa login sayfasına yönlendirir.
 */
export const useRequireToken = (): string => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext || !authContext.token) {
    router.push("/login");
    throw new Error("Giriş yapılması gerekiyor.");
  }

  return authContext.token;
};
