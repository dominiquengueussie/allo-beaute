//Ce plugin Nuxt qui restaure la session avant que les middlewares s'exécutent
//Nuxt le détecte automatiquement au démarrage et l'exécute comme un plugin global.

export default defineNuxtPlugin(() => {
    const auth = useAuthStore()
    auth.restoreSession()
})
