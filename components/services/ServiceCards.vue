<script setup>
import { Star, Clock, ChevronLeft, ChevronRight } from "lucide-vue-next";

// Configuration de base
const perPage = ref(10);
const currentPage = ref(1);
const apiEndpoint =
    "https://demo-allobeaute.tikaplace.com/api/services/catalog";

// États pour la recherche
const searchQuery = ref("");
const isLoading = ref(false);
const searchResults = ref(null);
const showNoResults = ref(false);
const searchError = ref(null);

// Fonction pour obtenir l'image sécurisée
const getServiceImage = (service) => {
    return service?.medias?.[0]?.link || "/placeholder-image.jpg";
};

const truncateText = (text, maxLength) => {
    if (!text) return ""; // Protection contre les valeurs null/undefined
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
};

// Fonction pour normaliser les données du service
const normalizeServiceData = (service) => {
    return {
        ...service,
        enterprise: service.enterprise || { name: "", address: "" },
        medias: service.medias || [],
        duration: service.duration || "N/A",
        price: service.price || "N/A",
    };
};

// Chargement initial
const { data: apiResponse, execute, status } = useFetch(
    () => `${apiEndpoint}?page=${currentPage.value}&perPage=${perPage.value}`,
    {
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
        },
        immediate: false,
        onResponseError: (error) => {
            console.error("API Error:", error);
        },
    }
);

// Services calculés avec données normalisées
const Services = computed(() => {
    return (apiResponse.value?.data || []).map(normalizeServiceData);
});

// Pagination
const pagination = computed(() => apiResponse.value?.meta || null);

// Navigation entre pages
function goToPage(page) {
    if (page < 1 || page > pagination.value?.last_page) return;
    currentPage.value = page;
    execute();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Recherche de services
const handleServiceSearch = async (serviceName) => {
    try {
        isLoading.value = true;
        searchError.value = null;
        showNoResults.value = false;
        searchQuery.value = serviceName;

        // Version optimisée pour votre API spécifique
        const searchTerm = serviceName.trim();
        const encodedTerm = encodeURIComponent(searchTerm);

        const { data, error } = await useFetch(
            `https://demo-allobeaute.tikaplace.com/api/services/catalog/search/${encodedTerm}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                server: false,
                onResponse({ response }) {
                    // Normalisation de la réponse pour votre API
                    if (response._data && !Array.isArray(response._data)) {
                        response._data = response._data.data || [];
                    }
                },
            }
        );

        // Debug crucial
        console.log("Search Term:", searchTerm);
        console.log("API Response:", data.value);

        if (error.value) throw error.value;

        // Gestion spéciale pour la structure de l'API
        const results = data.value?.data || data.value || [];
        searchResults.value = Array.isArray(results)
            ? results.map(normalizeServiceData)
            : [];

        showNoResults.value = searchResults.value.length === 0;
    } catch (error) {
        console.error("Search error:", error);
        searchError.value = "Service temporairement indisponible";
        showNoResults.value = true;
    } finally {
        isLoading.value = false;
    }
};

// Réinitialisation de la recherche
const resetSearch = () => {
    searchQuery.value = "";
    searchResults.value = null;
    showNoResults.value = false;
    searchError.value = null;
};

// Chargement initial
onMounted(async () => {
    await execute();
});
const handleBookService = (serviceId) => {
    navigateTo(`/prestataires/${serviceId}`);
};
</script>

<template>
    <HeroSection @search-service="handleServiceSearch" />

    <div class="w-full mx-auto px-4 py-12 flex flex-col lg:flex-row">
        <aside>
            <FiltersSidebar />
        </aside>

        <main class="flex-1">
            <div class="flex justify-between items-center mb-8">
                <h2 class="title-font text-2xl font-semibold text-gray-800">
                    {{
                        searchQuery
                            ? `Résultats pour "${searchQuery}"`
                            : "Tous nos prestataires"
                    }}
                </h2>
                <div class="flex items-center">
                    <span class="text-sm text-gray-500 mr-2">Trier par :</span>
                    <select
                        class="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300">
                        <option>Pertinence</option>
                        <option>Meilleures notes</option>
                        <option>Prix croissant</option>
                        <option>Prix décroissant</option>
                    </select>
                </div>
            </div>

            <!-- État de chargement -->
            <div v-if="isLoading || status === 'pending' " class="flex flex-col items-center justify-center py-12">
                <div  class="flex gap-2 justify-center items-center py-8 min-h-[200px]">
                    <SkeletonCard v-for="n in 4" :key="n" />
                </div>
            </div>

            <!-- Message d'erreur -->
            <div v-else-if="searchError" class="text-center py-12">
                <p class="text-red-500 mb-4">{{ searchError }}</p>
                <button @click="resetSearch" class="text-gold hover:underline">
                    Réessayer ou afficher tous les services
                </button>
            </div>

            <!-- Aucun résultat -->
            <div v-else-if="showNoResults" class="text-center py-12">
                <p class="text-gray-600 text-lg">
                    Aucun service trouvé pour "{{ searchQuery }}"
                </p>
                <button @click="resetSearch" class="mt-4 text-slate-900 hover:underline">
                    Afficher tous les services
                </button>
            </div>

            <!-- Liste des services -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 sm:px-0">
                <div v-for="service in searchResults || Services" :key="service.id"
                    class="bg-slate-900 rounded-lg md:rounded-xl shadow-md overflow-hidden card-hover fade-in">
                    <div class="relative">
                        <img :src="getServiceImage(service)" class="w-full h-40 sm:h-48 object-cover"
                            :alt="service.name" />
                        <div
                            class="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gold text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
                            Top Prestataire
                        </div>
                    </div>

                    <div class="p-4 md:p-6">
                        <!-- Contenu de la carte avec données protégées -->
                        <div class="flex justify-between items-center">
                            <div class="flex items-center justify-start text-sm md:text-[16px]">
                                <img :alt="service.name" class="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover mr-2"
                                    :src="getServiceImage(service)" />
                                <h4 class="font-semibold text-white text-sm md:text-[16px]">
                                    {{ truncateText(service.enterprise.name, 15) }}
                                </h4>
                            </div>
                            <div class="flex items-center">
                                <Star class="text-white ml-2 w-3 h-3 md:w-4 md:h-4" />
                                <span class="ml-1 text-gold text-xs md:text-sm">(125)</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-start mt-2 md:mt-3">
                            <div class="w-3/4">
                                <h3 class="title-font font-semibold text-xs md:text-[13px] text-white">
                                    {{ truncateText(service.name, 30) }}
                                </h3>
                            </div>
                            <div>
                                <p class="text-xs md:text-[14px] flex items-center">
                                    <Clock class="text-gold mr-1 h-3 w-3 md:h-4 md:w-4" />
                                    <span class="text-white">{{ service.duration }} min</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center justify-between text-xs md:text-sm mt-2 md:mt-3">
                            <div class="flex items-center text-white">
                                <span>📍</span>
                                <span class="ml-1">{{ truncateText(service.enterprise.address, 20) }}</span>
                            </div>
                            <div>
                                <span class="text-gold">
                                    {{ service.price }} Fcfa
                                </span>
                            </div>
                        </div>
                        <div
                            class="mt-3 md:mt-4 pt-3 md:pt-4 flex justify-between items-center border-t border-slate-700">
                            <NuxtLink @click.prevent="handleBookService(service.id)"
                                class="bg-gold hover:bg-yellow-golden text-slate-900 px-3 py-1 md:px-4 md:py-2 cursor-pointer rounded-full text-xs md:text-sm font-medium transition">
                                Voir les détails
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination (seulement quand pas de recherche) -->
            <div v-if="!searchQuery && pagination?.last_page > 1" class="mt-8 flex justify-center">
                <nav class="flex items-center space-x-2" aria-label="Pagination">
                    <button @click="goToPage(currentPage - 1)" :disabled="!pagination?.prev_page_url"
                        class="px-4 py-2 h-12 w-12 flex items-center justify-center border border-gray-300 rounded-full text-gray-500 hover:bg-pink-50 hover:text-pink-600">
                        <ChevronLeft class="w-10 h-10 font-bold" />
                    </button>

                    <button v-for="page in pagination?.last_page" :key="page" @click="goToPage(page)"
                        class="w-10 h-10 rounded-full" :class="page === currentPage
                            ? 'bg-gold text-white'
                            : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                            ">
                        {{ page }}
                    </button>

                    <button @click="goToPage(currentPage + 1)" :disabled="!pagination?.next_page_url"
                        class="px-4 py-2 h-12 w-12 flex items-center justify-center border border-gray-300 rounded-full text-gray-500 hover:bg-pink-50 hover:text-pink-600">
                        <ChevronRight class="w-10 h-10 font-bold" />
                    </button>
                </nav>
            </div>
        </main>
    </div>
</template>
