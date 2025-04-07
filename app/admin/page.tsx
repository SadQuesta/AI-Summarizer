"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

export default function AdminPage() {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!token) return; // ❗ Token hazır değilse hiç fetch etme
      
        const fetchUsers = async () => {
          try {
            const res = await fetch("http://localhost:8000/api/admin/users", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
      
            if (!res.ok) {
              const errorText = await res.text();
              console.error("❌ Admin user fetch hatası:", res.status, errorText);
              return;
            }
      
            const data = await res.json();
            setUsers(data);
          } catch (err) {
            console.error("❌ Ağ hatası:", err);
          }
        };
      
        fetchUsers();
      }, [token]);

    return (
        <ProtectedRoute requireAdmin>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Admin Panel - Kullanıcı Listesi</h1>
                <ul className="space-y-3">
                    {users.map((user) => (
                        <li key={user.id} className="p-3 bg-gray-100 rounded">
                            <strong>{user.username}</strong> – {user.email} – Rol: {user.role||"Kullanıcı"}
                        </li>
                    ))}
                </ul>
            </div>
        </ProtectedRoute>
    );
}
