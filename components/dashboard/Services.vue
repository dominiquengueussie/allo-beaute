<script setup>
import {
  Ellipsis,
  Search,
  Bell,
  Plus,
  Euro,
  ChevronDown,
  Grid,
  Clock9,
  MapPin,
  Flame,
  Hand,
  Sparkles,
  Scissors,
  ArrowDownNarrowWide,
  SquarePen,
  Trash2,
  ConciergeBell,
  TriangleAlert,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";
const toast = useToast();
const userAvatar =
  "https://readdy.ai/api/search-image?query=professional%2520portrait%2520of%2520a%2520beautiful%2520young%2520French%2520woman%2520with%2520short%2520brown%2520hair%252C%2520warm%2520smile%252C%2520natural%2520makeup%252C%2520beauty%2520salon%2520owner%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=1&orientation=squarish";
// Categories
const categories = ref([
  { id: "all", name: "Tous les services", icon: Grid },
  { id: "facial", name: "Soins du visage", icon: Flame },
  { id: "massage", name: "Massages", icon: Hand },
  { id: "nails", name: "Manucure/Pédicure", icon: Sparkles },
  { id: "hair", name: "Coiffure", icon: Scissors },
]);
const auth = useAuthStore();
//console.log("auth", auth);
const userToken = auth.token;
const apiEndpoint = "https://demo-allobeaute.tikaplace.com/api/services";

// Fonctions utilitaires
const formatPrice = (price) => {
  return parseFloat(price)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$& ");
};
const handleImageError = (event) => {
  event.target.src = "/placeholder-image.jpg";
};

const toggleServiceStatus = async (service) => {
  try {
    await $fetch(`https://demo-allobeaute.tikaplace.com/api/services/toggle-activation/${service.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
  } catch (error) {
    toast.error("Erreur lors du changement de statut:", error);
    service.is_active = !service.is_active; // Revert on error
  }
};
const retryFetch = async () => {
  await execute();
};

onMounted(() => {
  execute();
});

const {
  data: apiResponse,
  status,
  error,
  execute,
} = await useFetch(apiEndpoint, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    Authorization: `Bearer ${userToken}`,
  },
  immediate: false,
});

const userServices = ref([]);

watch(apiResponse, (newResponse) => {
  if (newResponse && newResponse.data) {
    userServices.value = newResponse.data;
  }
});

//const apiMessage = computed(() => apiResponse.value?.message || "");
const searchQuery = ref("");
const selectedCategory = ref("all");
const priceFilter = ref("all");
const durationFilter = ref("all");
const sortBy = ref("name-asc");
const openDropdown = ref("");
const showServiceModal = ref(false);
const showDeleteModal = ref(false);
const serviceToDeleteName = ref(null);
const serviceToDelete = ref(null);
const isDeletting = ref(false);
const currentService = ref({
  id: 0,
  name: "",
  categoryId: "facial",
  price: 0,
  duration: 0,
  description: "",
  image: "",
});
// Toggle filter dropdowns
const toggleFilterDropdown = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? "" : dropdown;
};
// Select category
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
};
// Get category name by ID
const getCategoryName = (categoryId) => {
  const category = categories.value.find((cat) => cat.id === categoryId);
  return category ? category.name : "";
};
// Filtered services
const filteredServices = computed(() => {
  let result = [...userServices.value];
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
    );
  }
  // Filter by category
  if (selectedCategory.value !== "all") {
    result = result.filter(
      (service) => service.categoryId === selectedCategory.value
    );
  }
  // Filter by price
  if (priceFilter.value !== "all") {
    switch (priceFilter.value) {
      case "low":
        result = result.filter((service) => service.price < 50);
        break;
      case "medium":
        result = result.filter(
          (service) => service.price >= 50 && service.price <= 100
        );
        break;
      case "high":
        result = result.filter((service) => service.price > 100);
        break;
    }
  }
  // Filter by duration
  if (durationFilter.value !== "all") {
    switch (durationFilter.value) {
      case "short":
        result = result.filter((service) => service.duration < 30);
        break;
      case "medium":
        result = result.filter(
          (service) => service.duration >= 30 && service.duration <= 60
        );
        break;
      case "long":
        result = result.filter((service) => service.duration > 60);
        break;
    }
  }
  // Sort results
  switch (sortBy.value) {
    case "name-asc":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "duration-asc":
      result.sort((a, b) => a.duration - b.duration);
      break;
    case "duration-desc":
      result.sort((a, b) => b.duration - a.duration);
      break;
  }
  return result;
});

// Edit service
const editService = (serviceId) => {
  navigateTo(`/services/${serviceId}`);
};

// Confirm delete service
const confirmDeleteService = (service) => {
  serviceToDeleteName.value = service;
  serviceToDelete.value = service.id;
  showDeleteModal.value = true;
};
// Close delete modal
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  serviceToDelete.value = null;
};
// Delete service
const deleteService = async () => {
  isDeletting.value = true;
  if (!serviceToDelete.value) {
    closeDeleteModal();
    return;
  }

  try {
    console.log("Service à supprimer:", serviceToDelete.value);
    
    const { data, error } = await useFetch(
      `https://demo-allobeaute.tikaplace.com/api/services/${serviceToDelete.value}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (error.value) {
      throw new Error(error.value.message || "Erreur lors de la suppression");
    }

    console.log("Réponse API:", data.value);
    const toast = useToast();

    if (data.value?.status === 'success') {
      toast.info("Service supprimé avec succès");
      // Rafraîchir la liste des services si nécessaire
      userServices.value = userServices.value.filter(service => service.id !== serviceToDelete.value);
    } else {
      throw new Error(data.value?.message || "Réponse inattendue de l'API");
    }
  } catch (err) {
    console.error("Erreur de suppression:", err);
    const toast = useToast();
    toast.error(err.message || "Une erreur est survenue lors de la suppression");
  } finally {
    closeDeleteModal();
    isDeletting.value = false;
  }
};

const getNotifications = () => {
  toast.info("Fonctionnalités bientôt disponible.");
};

</script>
<template>
  <div class="ml-64 flex-1">
    <!-- Header -->
    <header class="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-5">
      <div class="flex items-center">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Rechercher un service..."
            class="pl-10 pr-4 py-2 border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
          <Search class="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative" @click="getNotifications()">
          <button class="text-gray-500 hover:text-slate-800 transition-colors duration-200 cursor-pointer">
            <Bell class="text-xl" />
            <span
              class="absolute -top-1 -right-1 bg-slate-900 text-gold text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </button>
        </div>
        <div class="flex items-center space-x-3 cursor-pointer">
          <div class="w-10 h-10 rounded-full overflow-hidden">
            <img :src="userAvatar" alt="Avatar utilisateur" class="w-full h-full object-cover" />
          </div>
          <div>
            <p class="font-medium text-sm">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-500">
              {{ auth.getUser()?.enterprise?.type || "Utilisateur" }}
            </p>
          </div>
        </div>
      </div>
    </header>
    <!-- Services Content -->
    <main class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Mes services</h1>
          <p class="text-gray-600">
            Gérez les services que vous proposez à vos clients
          </p>
        </div>
        <NuxtLink to="/create-service"
          class="bg-slate-900 hover:bg-slate-700 text-gold px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
          <Plus class="mr-2" /> Ajouter un service
        </NuxtLink>
      </div>
      <!-- Filters and Categories -->
      <!-- <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex flex-wrap gap-4 mb-6">
          <button v-for="category in categories" :key="category.id" @click="selectCategory(category.id)" :class="[
            'px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap',
            selectedCategory === category.id
              ? 'bg-slate-900 text-gold'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]">
            <component :is="category.icon" class="w-5 h-5 mr-2" />
            {{ category.name }}
          </button>
        </div>
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex gap-4">
            <div class="relative">
              <button @click="toggleFilterDropdown('price')"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                <Euro class="mr-2 h-4 w-4" />
                Prix
                <ChevronDown class="ml-2 text-xs w-4 h-4" />
              </button>
              <div v-if="openDropdown === 'price'"
                class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 z-10 w-48">
                <div class="space-y-2">
                  <label class="flex items-center cursor-pointer">
                    <input type="radio" v-model="priceFilter" value="all" class="mr-2" />
                    <span>Tous les prix</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input type="radio" v-model="priceFilter" value="low" class="mr-2" />
                    <span>Moins de 50€</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input type="radio" v-model="priceFilter" value="medium" class="mr-2" />
                    <span>50€ - 100€</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input type="radio" v-model="priceFilter" value="high" class="mr-2" />
                    <span>Plus de 100€</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="relative">
              <button @click="toggleFilterDropdown('duration')"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                <Clock9 class="mr-2 w-4 h-4" />
                Durée
                <i class="fas fa-chevron-down ml-2 text-xs"></i>
                <ChevronDown class="mr-2 w-4 h-4" />
              </button>
              <div v-if="openDropdown === 'duration'"
                class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 z-10 w-48">
                <div class="space-y-2">
                  <label class="flex items-center cursor-pointer">
                    <input type="radio" v-model="durationFilter" value="all" class="mr-2" />
                    <span>Toutes les durées</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input type="radio" v-model="durationFilter" value="short" class="mr-2" />
                    <span>Moins de 30 min</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input type="radio" v-model="durationFilter" value="medium" class="mr-2" />
                    <span>30 - 60 min</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input type="radio" v-model="durationFilter" value="long" class="mr-2" />
                    <span>Plus de 60 min</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="relative">
            <button @click="toggleFilterDropdown('sort')"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
              <ArrowDownNarrowWide class="mr-2 w-4 h-4" />
              Trier par
              <ChevronDown class="ml-1 w-4 h-4" />
            </button>
            <div v-if="openDropdown === 'sort'"
              class="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 z-10 w-48">
              <div class="space-y-2">
                <label class="flex items-center cursor-pointer">
                  <input type="radio" v-model="sortBy" value="name-asc" class="mr-2" />
                  <span>Nom (A-Z)</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input type="radio" v-model="sortBy" value="name-desc" class="mr-2" />
                  <span>Nom (Z-A)</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input type="radio" v-model="sortBy" value="price-asc" class="mr-2" />
                  <span>Prix (croissant)</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input type="radio" v-model="sortBy" value="price-desc" class="mr-2" />
                  <span>Prix (décroissant)</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input type="radio" v-model="sortBy" value="duration-asc" class="mr-2" />
                  <span>Durée (croissante)</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input type="radio" v-model="sortBy" value="duration-desc" class="mr-2" />
                  <span>Durée (décroissante)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div v-if="status === 'pending'" class="flex flex-col justify-center items-center py-8 min-h-[200px]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
        <span class="mt-3 text-slate-900">Chargement en cours...</span>
      </div>
      <div v-else-if="status === 'error'" class="text-red-500 p-4 text-center mt-10">
        <p v-if="error?.statusCode === 403">
          Vous n'êtes pas autorisé à accéder à cette ressource. Contactez le support.
        </p>
        <p v-else>
          Erreur lors du chargement : {{ error?.message || "Erreur inconnue" }}
        </p>
        <button @click="retryFetch" class="mt-2 text-gold hover:underline bg-slate-900 px-4 py-2 rounded-md">
          Réessayer
        </button>
      </div>
      <!-- Services Grid -->
      <div v-else-if="status === 'success' && apiResponse?.data?.length">
        <div v-if="filteredServices.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="service in filteredServices" :key="service.id"
            class="bg-slate-900 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border">
            <!-- Image du service -->
            <div class="h-48 overflow-hidden">
              <img :src="service.medias[0]?.link || '/placeholder-image.jpg'" :alt="service.name"
                class="w-full h-full object-cover object-top" @error="handleImageError" />
            </div>

            <div class="p-5">
              <!-- Nom et catégorie -->
              <div class="flex justify-between items-start mb-2">
                <h6 class="font-bold text-white">
                  {{ service.name }}
                </h6>
                <span class="bg-gray-600 text-gold text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                  {{ service.category || "Non catégorisé" }}
                </span>
              </div>

              <!-- Durée et prix -->
              <div class="flex items-center justify-between text-sm text-white mb-3">
                <span class="flex items-center mr-4">
                  <Clock9 class="mr-2 w-4 h-4" />
                  {{ service.duration }} min
                </span>
                <span class="font-medium text-gold">{{ formatPrice(service.price) }} FCFA</span>
              </div>
              <!-- Informations entreprise -->
              <div class="flex items-center text-xs text-gray-500 mb-4">
                <span class="flex items-center">
                  <MapPin class="mr-1 w-3 h-3" />
                  {{ service.enterprise?.name || "Indépendant" }}
                </span>
                <span class="mx-2">•</span>
                <span>{{ service.enterprise?.city || "Ville inconnue" }}</span>
              </div>

              <!-- Statut et actions -->
              <div class="flex justify-between space-x-2">
                <div class="flex items-center space-x-2">
                  <span :class="{
                    'bg-green-100 text-green-800': service.is_active,
                    'bg-red-100 text-red-800': !service.is_active,
                  }" class="text-xs font-semibold px-2.5 py-1 rounded-full border">
                    {{ service.is_active ? "Actif" : "Inactif" }}
                  </span>

                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="service.is_active" @change="toggleServiceStatus(service)"
                      class="sr-only peer" />
                    <div
                      class="group peer ring-0 bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600 rounded-full outline-none duration-1000 after:duration-300 w-12 h-6 shadow-md peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:[background:#0D2B39] peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)] after:outline-none after:h-4 after:w-4 after:top-1 after:left-1 peer-checked:after:translate-x-6 peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900">
                    </div>
                  </label>
                </div>

                <div>
                  <button @click="editService(service.id)"
                    class="text-gray-300 hover:text-gold p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <SquarePen class="w-4 h-4" />
                  </button>
                  <button @click="confirmDeleteService(service)"
                    class="text-gray-300 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <button @click="toggleMenu" title="Options supplémentaires"
                    class="text-gray-300 hover:text-gold p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-sm p-10 text-center">
        <div class="mb-4 text-gray-400 flex items-center justify-center">
          <ConciergeBell class="text-5xl" />
        </div>
        <h3 class="text-xl font-medium text-gray-800 mb-2">
          Aucun service disponible pour le moment.
        </h3>
        <div class="flex mt-6 items-center justify-center">
          <NuxtLink to="/create-service"
            class="bg-slate-900 hover:bg-gold text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
            <Plus class="mr-2" /> Ajouter un service
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md" @click.stop>
      <div class="p-6">
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <TriangleAlert class="text-red-600 text-2xl" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Confirmer la suppression
          </h3>
          <p class="text-gray-600">
            Êtes-vous sûr de vouloir supprimer le service
            <span class="font-medium text-gray-900">{{ serviceToDeleteName.name }}</span> ? Cette
            action est irréversible.
          </p>
        </div>
        <div class="flex justify-center space-x-3">
          <button @click="closeDeleteModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
            Annuler
          </button>
          <button @click="deleteService"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
            <div class="flex items-center mr-2">
              <div v-if="isDeletting" class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white">
              </div>
              <span class="ml-2"> {{
                isDeletting
                  ? "Supprission en cours... "
                  : "Supprimer le service"
                }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h6 {
  font-family: "Playfair Display", serif;
}
</style>
