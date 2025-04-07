export const createSummary = async (text, format_type, length, token) => {
    const response = await fetch("http://localhost:8000/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ text, format_type, length }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Özetleme sırasında hata oluştu");
    }
  
    return await response.json();
  };
  
  export async function registerUser(username, email, password) {
    const response = await fetch("http://localhost:8000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Kayıt sırasında hata oluştu");
    }
  
    return await response.json();
  }
  
  export async function loginUser(loginId, password) {
    const response = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login_id: loginId, password }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Giriş sırasında hata oluştu");
    }
  
    return await response.json();
  }
  
  export async function getUserProfile(token) {
    const response = await fetch("http://localhost:8000/api/profile/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      console.error(`❌ Profil bilgisi alınamadı! HTTP Status: ${response.status}`);
      throw new Error("Profil bilgisi alınamadı");
    }
  
    return await response.json();
  }
  
  export async function getSummaries(token) {
    const response = await fetch("http://localhost:8000/api/profile/summaries", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      console.error("Özetler alınamadı! HTTP Status:", response.status);
      return { summaries: [] };
    }
  
    return await response.json();
  }
  
  export async function uploadProfilePicture(file, token) {
    const formData = new FormData();
    formData.append("file", file);
  
    const response = await fetch("http://localhost:8000/api/profile/upload-profile-picture", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  
    if (!response.ok) throw new Error("Fotoğraf yüklenemedi.");
  
    return await response.json(); // { image_url: "http://..." }
  }
  
  export async function deleteSummary(id, token) {
    const response = await fetch(`http://localhost:8000/api/summaries/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Özet silinemedi.");
    }
  
    return await response.json();
  }
  
  export const downloadSummaryAsPDF = async (id, token) => {
    try {
      const response = await fetch(`http://localhost:8000/api/summaries/${id}/download-pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("PDF indirilemedi");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = `summary_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF indirme hatası:", error);
    }
  };
  
  export const generateBanner = async (token) => {
    const response = await fetch("http://localhost:8000/api/profile/generate-banner", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("Banner oluşturulamadı: " + (errorData?.detail || ""));
    }
  
    return await response.json();
  };
  
  export const toggleFavoriteSummary = async (id, token) => {
    const response = await fetch(`http://localhost:8000/api/summaries/${id}/toggle-favorite`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Favori değiştirme başarısız");
    }
  
    return await response.json();
  };
  