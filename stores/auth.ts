import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const token = useCookie<string | null>("auth_token", { sameSite: "strict", maxAge: 60 * 60 * 24 * 2});
  const user = useCookie<any>("auth_user", { sameSite: "strict", maxAge: 60 * 60 * 24 * 2});// deux jours de sauvegarde

  const setAuthData = (authData: { token: string; user: any }) => {
    // Mise à jour des cookies
    token.value = authData.token;
    user.value = authData.user;

    // Écriture explicite dans localStorage pour garantir la persistance côté client
    if (process.client) {
      localStorage.setItem("auth_token", authData.token);
      localStorage.setItem("auth_user", JSON.stringify(authData.user));
    }
  };

  // Appelée quand la page est rechargée
  const restoreSession = () => {
    if (process.client) {
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");
      if (savedToken && !token.value) token.value = savedToken;
      if (savedUser && !user.value) user.value = JSON.parse(savedUser);
    }
  };

  const getToken = () => token.value || '';
  const getUser = () => user.value || null;

  const clearAuthData = () => {
    token.value = null;
    user.value = null;
    if (process.client) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  };

    async function logout() {
    const res = await $fetch(
      "https://demo-allobeaute.tikaplace.com/api/user/logout",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    clearAuthData();
  }

  // Nouvelle méthode pour mettre à jour les données utilisateur
  const updateUserData = (userData: any) => {
    if (user.value) {
      user.value = { ...user.value, ...userData };
    }
    // Mettre à jour aussi localStorage
    if (process.client) {
      localStorage.setItem("auth_user", JSON.stringify(user.value));
    }
  };

  return {
    token,
    user,
    setAuthData,
    clearAuthData,
    restoreSession,
    logout,
    getToken,
    getUser,
    updateUserData
  };
});
