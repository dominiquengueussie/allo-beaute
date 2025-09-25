// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
   vite:{
    esbuild:{
      supported:{
        'top-level-await': true
      }
    }
  },
  build:{
    transpile:['vue-toastification']
  },
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    }
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  pages: true, // Active le système de pages
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
  ],
  css: ["~/assets/css/main.css", '~/assets/css/tailwind.css'],
  plugins: [
    '~/plugins/flowbite.client' 
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  shadcn: {
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      apiKey: "AIzaSyALmnC8CNzb72w5Dhzg0gbwoqMHG3xLD6k",
      authDomain: "allobeaute-2bc68.firebaseapp.com",
      projectId: "allobeaute-2bc68",
      storageBucket: "allobeaute-2bc68.firebasestorage.app",
      messagingSenderId: "644892511267",
      appId: "1:644892511267:web:bd3580d2d8f2f76dc9b596",
      measurementId: "G-77FMMRBYKG",
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false, // Important pour les sous-dossiers
      extensions: [".vue"],
      prefix: "", // Aucun préfixe pour les composants de pages
    },
    {
      path: "~/pages",
      pathPrefix: false, // Permet d'importer sans préfixe
      extensions: [".vue"],
      prefix: "", // Aucun préfixe pour les composants de pages
    },
    {
      path: "~/components/ui", // Pour shadcn
      prefix: "", // Comme configuré pour shadcn
    },
  ],
  app: {
    head: {
      title: 'Allô Beauté | Leader de prestation de service de beauté',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      script: [
        {
          src: "",
          type: "text/javascript",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",
          integrity: "sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==",
          crossorigin: "anonymous",
          referrerpolicy: "no-referrer"
        },
      /*   {
          href: "https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css",
          rel: "stylesheet"
        } */
      ],
    },
  },
});
