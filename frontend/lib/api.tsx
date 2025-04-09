 const BASE_URL ="http://localhost:8000" //process.env.NEXT_PUBLIC_API_URL;

// ✅ Özet oluşturma
export const createSummary = async (
  text: string|null,
  format_type: string,
  length: string,
  token: string
) => {
  const response = await fetch(`${BASE_URL}/api/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, format_type, length }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Özetleme sırasında hata oluştu");
  }

  return await response.json();
};

// ✅ Kayıt
export async function registerUser(username: string, email: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Kayıt sırasında hata oluştu");
  }

  return await response.json();
}

// ✅ Giriş
export async function loginUser(loginId: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login_id: loginId, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Giriş sırasında hata oluştu");
  }

  return await response.json();
}

// ✅ Profil bilgisi alma
export async function getUserProfile(token: string) {
  const response = await fetch(`${BASE_URL}/api/profile/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Profil bilgisi alınamadı");
  }

  return await response.json();
}

// ✅ Kullanıcının özet geçmişi
export async function getSummaries(token: string) {
  const response = await fetch(`${BASE_URL}/api/profile/summaries`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Özetler alınamadı! HTTP Status:", response.status);
    return { summaries: [] };
  }

  return await response.json();
}

// ✅ Profil resmi yükleme
export async function uploadProfilePicture(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/api/profile/upload-profile-picture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Fotoğraf yüklenemedi.");
  }

  return await response.json(); // { image_url: "..." }
}

// ✅ Özet silme
export async function deleteSummary(id: number, token: string) {
  const response = await fetch(`${BASE_URL}/api/summaries/${id}`, {
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

// ✅ PDF indir
export const downloadSummaryAsPDF = async (id: number, token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/summaries/${id}/download-pdf`, {
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

// ✅ AI banner oluşturma
export const generateBanner = async (token: string) => {
  const response = await fetch(`${BASE_URL}/api/profile/generate-banner`, {
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

