export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  if (process.client) {
    // Restaurer les données immédiatement si elles n'existent pas déjà
    if (!auth.token) {
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (savedToken && savedUser) {
        auth.token = savedToken;
        auth.user = JSON.parse(savedUser);
      }
    }

    // Toujours vérifier le token après restauration
    if (!auth.token) {
      return navigateTo("/auth/login");
    }
  }
});
