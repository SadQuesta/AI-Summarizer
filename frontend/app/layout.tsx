

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/app/globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "AI Summarize",
  description: "AI Summarized Advanced App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="bg-gray-100 text-gray-900 flex justify-center items-center min-h-screen">
          <div className="flex flex-col min-w-[1600px] min-h-[800px] max-w-7xl bg-white rounded-2xl shadow-lg p-8">
            
            {/* Navbar tüm sayfalarda olacak */}
            <Navbar />

            {/* Sayfa içeriği */}
            <main className="flex-grow px-4 py-6">
              {children}
            </main>

            {/* Footer tüm sayfalarda olacak */}
            <Footer />
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
