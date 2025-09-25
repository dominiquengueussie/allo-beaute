<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { useSearchStore } from '#imports';

const searchQuery = ref("");
const isLoading = ref(false);
const auth = useAuthStore();
import { useToast } from 'vue-toastification';
const toast = useToast();

const searchStore = useSearchStore();

/* console.log('User connecté :', auth.getUser())
console.log('Token :', auth.token) */

interface UserResponse {
  data: {
    id: string;
    name: string;
    surname: string;
    fullname: string;
    phone_number: string;
    role: string;
    is_active: boolean;
    enterprise?: {
      id: string;
      name: string;
      type: string;
      description: string;
      phone_number: string;
      email: string;
      address: string;
      city: string;
      repere: string;
      experience_years: number;
      is_independent: boolean;
      is_verified: boolean;
      services_categories: Array<{
        id: string;
        name: string;
        description: string;
        created_at: string;
      }>;
    };
  };
}

interface SearchResult {
  id: number;
  name: string;
  type: "service" | "product";
  price: number;
  icon?: string;
  brand?: string;
  provider?: string;
}

const searchResults = computed<SearchResult[]>(() => {
  // Implement search logic here
  return [];
});
const becomeProvider = async () => {
  // 1. Vérifier si l'utilisateur est connecté
  if (!auth.getUser() && !auth.getToken()) {
    navigateTo("/becomeProvider");
    return;
  }

  isLoading.value = true;
  try {
    // 2. Récupérer les données actuelles de l'API avec le type explicite
    const updatedUserResponse = await $fetch<UserResponse>(
      "https://demo-allobeaute.tikaplace.com/api/user",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.getToken()}`,
        },
      }
    ) as UserResponse;

    // 3. Mettre à jour le store immédiatement
    if (updatedUserResponse.data) {
      auth.updateUserData(updatedUserResponse.data);
      //console.log("Structure exacte de la réponse API:", JSON.stringify(updatedUserResponse, null, 2));
    }

    // 4. Vérifier le rôle à partir des données de l'API
    if (updatedUserResponse.data.role === "Prestataire") {
      toast.info("Vous êtes déjà prestataire.");
      return;
    }

    // 5. Si client, rediriger
    if (updatedUserResponse.data.role === "Client") {
      await navigateTo("/becomeProvider/becomeProvider");
      return;
    }

  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Une erreur est survenue, contactez l'administrateur du site");
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  searchStore.performSearch(searchQuery.value);
}
</script>

<template>
  <div class="hero-image flex-grow flex items-center justify-center text-center text-white py-20">
    <div class="max-w-4xl px-4 w-full">
      <h1 class="text-4xl md:text-5xl font-bold mb-6">
        Votre beauté, notre passion
      </h1>
      <p class="text-xl mb-8">
        Découvrez les meilleurs prestataires de beauté près de chez vous et
        réservez vos services en quelques clics.
      </p>

      <!-- Search Bar -->
      <form @submit.prevent="handleSearch" class="relative max-w-2xl mx-auto mb-8">
        <div class="relative">
          <input v-model="searchQuery" type="text"
            placeholder="Rechercher un service ou produit..."
            class="w-full px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-900" />
          <button type="submit" class="absolute right-2 top-2 bg-slate-900 hover:bg-yellow-golden text-white p-2 rounded-full">
            <Search />
          </button>
        </div>
      </form>

      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <NuxtLink @click="becomeProvider"
          class="bg-slate-900 hover:cursor-pointer hover:bg-yellow-golden hover:text-slate-900 text-gold px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 flex items-center justify-center gap-2"
          :class="{ 'opacity-75 cursor-wait': isLoading }">
          <span>{{ isLoading ? 'Redirection en cours...' : 'Devenir prestataire' }}</span>
          <div v-if="isLoading" class="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
        </NuxtLink>
        <NuxtLink to="/services"
          class="bg-white hover:bg-gold hover:text-slate-900 text-slate-900 px-6 py-3 rounded-lg text-lg font-semibold transition duration-300">
          Découvrir nos services
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-image {
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80");
  background-size: cover;
  background-position: center;
}

.search-results {
  position: absolute;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 8px 8px;
}

.search-item:hover {
  background-color: #f9fafb;
}
</style>
