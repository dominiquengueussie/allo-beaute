<script setup>
const auth = useAuthStore()
definePageMeta({
  layout: "customheader",
  title: "Prestataire - Détente & Bien-être",
  meta: [
    {
      name: "description",
      content:
        "Découvrez le profil de notre prestataire de services de bien-être, Julie Kamga. Profitez de ses massages relaxants et thérapeutiques dans un cadre apaisant.",
    },
    {
      name: "keywords",
      content:
        "prestataire, bien-être, massage, thérapeutique, relaxation, Paris",
    },
  ],
});
import { useToast } from "vue-toastification";
const toast = useToast();
import {
  Star,
  CalendarPlus2,
  BadgeCheck,
  Phone,
  Mail,
  MapPin,
  Dot,
  Building2,
  Clock,
  MoveRight,
} from "lucide-vue-next";
const route = useRoute();
const providerId = route.params.id;

const currentPage = ref(1);
const perPage = ref(1);
const apiEndpoint1 = `https://demo-allobeaute.tikaplace.com/api/services/${providerId}`;
const apiEndpoint2 = `https://demo-allobeaute.tikaplace.com/api/services/${providerId}/same-enterprise`;
const retryFetch = async () => {
  await execute1();
};

const {
  data: apiResponse1,
  status: status1,
  error: error1,
  execute: execute1,
} = useFetch(apiEndpoint1, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  immediate: false,
});

const { data: apiResponse2, execute: execute2 } = useFetch(
  () => `${apiEndpoint2}?page=${currentPage.value}&perPage=${perPage.value}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    immediate: false,
  }
);

// Métadonnées de pagination
const pagination = computed(() => {
  return apiResponse2.value?.meta || null;
});

// Changement de page
function goToPage(page) {
  if (page < 1 || page > pagination.value?.last_page) return;
  currentPage.value = page;
  execute2();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const providerDetails = computed(() => {
  return apiResponse1.value?.data || null;
});

const hasData = computed(() => {
  return status1.value === "success" && providerDetails.value;
});

onMounted(async () => {
  try {
    await Promise.all([execute1(), execute2()]);
    //console.log("Données reçues:", apiResponse2.value);
  } catch (e) {
    console.error("Erreur:", e);
  }
});

// Services du prestataire principal
const providerServices = computed(() => {
  if (!providerDetails.value) return [];

  return [
    {
      id: providerId,
      enterpriseId: providerDetails.value.enterprise?.id || null,
      name: providerDetails.value.name,
      description: providerDetails.value.description,
      price: providerDetails.value.price,
      duration: providerDetails.value.duration,
      enterpriceName: providerDetails.value.enterprise?.name || "",
      adress: providerDetails.value.enterprise?.address || "",
      city: providerDetails.value.enterprise?.city || "",
      medias: providerDetails.value.medias[0] || {},
      verified: providerDetails.value.enterprise?.is_verified || false,
      rating: 4.8,
      reviews: 12,
      served_at_home: providerDetails.value.served_at_home,
      sponsored: false,
    },
  ];
});

// Services de la même entreprise
const enterpriseServices = computed(() => {
  if (!apiResponse2.value?.data) return [];

  return apiResponse2.value.data.map((service) => ({
    id: service.id,
    enterpriseId: service.enterprise?.id || null,
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
    enterpriceName: service.enterprise?.name || "",
    medias: service.medias[0] || {},
    verified: service.enterprise?.is_verified || false,
    rating: 4.5,
    reviews: 8,
    served_at_home: service.served_at_home,
    sponsored: false,
  }));
});
// Combinaison des services
const allServices = computed(() => {
  return [...providerServices.value, ...enterpriseServices.value];
});

const { allService, paginationCart, goToPageCart, currentPageCart } =
  defineProps({
    allService: Array,
    paginationCart: Object,
    goToPage: Function,
    currentPageCart: Number,
  });

const { addService, serviceCart } = useCart();
const addToCart = async (service) => {
  if (!auth.token) {
    navigateTo("/auth/login");
    return;
  }
  if (!service.id) {
    console.error("Erreur : Service sans identifiant", service);
    return;
  }
  if (serviceCart.value.length > 0 &&
    serviceCart.value[0].enterpriseId !== service.enterpriseId) {
    toast.info("Vous ne pouvez réserver que chez un seul prestataire à la fois. Veuillez finaliser votre réservation actuelle ou vider votre panier.");
    return;
  }
  addService(
    {
      ...service,
      id: service.id,
      enterpriseId: service.enterpriseId || null,
    },
    true
  );
};
</script>

<template>
  <div class="bg-gray-50 font-sans min-h-screen">
    <!-- Header avec image de fond -->
    <div class="relative bg-gradient-to-r from-slate-700 to-slate-900 h-64 flex items-center justify-center">
      <div class="absolute inset-0 bg-black opacity-40"></div>
      <div class="relative z-10 text-center px-4">
        <h1 class="text-4xl font-bold text-white mb-2 animate-on-scroll">
          Détente & Bien-être
        </h1>
        <p class="text-xl text-gray-200 animate-on-scroll">
          Découvrez les services exceptionnels du prestatire
        </p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Chargement -->
      <div v-if="status1 === 'pending'" class="flex gap-4 justify-center">
        <div v-for="n in 4" :key="n" class="w-64 h-96 bg-white rounded-xl shadow-md p-4 animate-pulse">
          <div class="bg-gray-200 h-40 rounded-lg mb-4"></div>
          <div class="bg-gray-200 h-4 rounded mb-2"></div>
          <div class="bg-gray-200 h-4 rounded w-3/4 mb-4"></div>
          <div class="bg-gray-200 h-8 rounded-full"></div>
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error1" class="text-center mt-20 mb-8 animate-on-scroll">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
          <h3 class="text-lg font-medium text-red-800 mb-2">
            Erreur lors du chargement
          </h3>
          <button @click="retryFetch"
            class="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition-colors">
            Réessayer
          </button>
        </div>
      </div>

      <!-- Succès -->
      <div v-else-if="hasData" class="animate-on-scroll">
        <!-- En-tête du prestataire -->
        <div class="text-center mt-8 mb-12">
          <div class="flex justify-center items-center gap-2">
            <div
              class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white shadow-xl overflow-hidden border-4 border-white transition-all hover:scale-105">
              <img :src="providerDetails?.medias?.[0]?.link || '/placeholder-user.jpg'
                " alt="Photo de profil" class="w-full h-full object-cover" />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-800">
                {{ providerDetails?.enterprise.name || "Nom non disponible" }}
              </h1>
              <span class="text-blue-500" v-if="providerDetails?.enterprise?.is_verified">
                <BadgeCheck class="w-5 h-5 mt-1" />
              </span>
              <div class="flex items-center text-amber-400">
                <Star class="w-5 h-5 fill-current" />
                <span class="ml-1 text-gray-700 font-medium">4.8</span>
                <span class="text-gray-600 ml-3">180 avis</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bio et coordonnées -->
        <!-- <div class="flex items-start px-5 mx-auto max-w-7xl bg-slate-700 py-2">
          <div class="flex-shrink-0">
            <i class="fas fa-info-circle text-xl text-white"></i>
          </div>
          <div class="ml-3">
            <h4 class="text-lg font-medium text-white">
              Informations importantes
            </h4>
            <p class="text-white mt-1">
              Veuillez réserver plusieurs services uniquement chez un
              prestataire à la fois.
            </p>
          </div>
        </div> -->
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">Politique de réservation</h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>
                  Notre système ne permet pas de réserver simultanément chez plusieurs prestataires.
                  Veuillez finaliser votre réservation avec le prestataire actuel avant d'en sélectionner un autre.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-slate-700 shadow-lg p-6 mb-8 border border-gray-100 animate-on-scroll">
          <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-2/3">
              <h2 class="text-2xl font-semibold text-gold mb-4">
                À propos de l'entreprise
              </h2>
              <p class="text-white leading-relaxed mb-6">
                {{
                  providerDetails?.enterprise.description ||
                  "Aucune description disponible"
                }}
              </p>

              <h2 class="text-2xl font-semibold text-gold mb-4">
                À propos du service
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-700">
                    <span class="font-semibold text-gray-900">Nom:</span>
                    {{ providerDetails?.name || "Aucun nom disponible" }}
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-700">
                    <span class="font-semibold text-gray-900">Catégorie:</span>
                    {{
                      providerDetails?.category || "Aucune categorie disponible"
                    }}
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-700">
                    <span class="font-semibold text-gray-900">Prix:</span>
                    {{ providerDetails?.price || "Aucun prix disponible" }}
                    Fcfa
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-700">
                    <span class="font-semibold text-gray-900">Durée:</span>
                    {{ providerDetails?.duration || "Aucun durée disponible" }}
                    min
                  </p>
                </div>
              </div>

              <div class="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-900 mb-2">Description:</h3>
                <p class="text-gray-700">
                  {{
                    providerDetails?.description ||
                    "Aucune description disponible"
                  }}
                </p>
              </div>
            </div>

            <div class="lg:w-1/3">
              <div class="sticky top-6">
                <div
                  class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-sm">
                  <h2 class="text-xl font-semibold text-gold mb-4">
                    Coordonnées
                  </h2>
                  <div class="space-y-4">
                    <div class="flex items-start gap-3">
                      <div class="bg-amber-100 p-2 rounded-full">
                        <Phone class="w-4 h-4 text-amber-800" />
                      </div>
                      <span class="text-gray-700 mt-1">{{
                        providerDetails?.enterprise?.phone_number ||
                        "Non renseigné"
                      }}</span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="bg-amber-100 p-2 rounded-full">
                        <Mail class="w-4 h-4 text-amber-800" />
                      </div>
                      <span class="text-gray-700 mt-1">{{
                        providerDetails?.enterprise?.email || "Non renseigné"
                      }}</span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="bg-amber-100 p-2 rounded-full">
                        <MapPin class="w-4 h-4 text-amber-800" />
                      </div>
                      <span class="text-gray-700 mt-1">
                        {{ providerDetails?.enterprise?.address }},
                        {{ providerDetails?.enterprise?.city }}
                      </span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="bg-amber-100 p-2 rounded-full">
                        <Building2 class="w-4 h-4 text-amber-800" />
                      </div>
                      <span class="text-gray-700 mt-1">
                        {{
                          providerDetails?.served_at_home
                            ? "À domicile"
                            : "En institut"
                        }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-6">
                    <button @click="toggleAvailability"
                      class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition" :class="providerDetails?.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                        ">
                      <Dot :class="providerDetails?.is_active
                          ? 'text-green-500'
                          : 'text-red-500'
                        " class="w-6 h-6 -ml-1" />
                      {{
                        providerDetails?.is_active
                          ? "Disponible maintenant"
                          : "Indisponible"
                      }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Section des services -->
        <h2 class="text-xl font-semibold text-slate-900 mb-4">
          Services proposés par l'entreprise
        </h2>
        <section v-if="allServices.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <article
              class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 w-full mx-auto"
              v-for="service in allServices" :key="service.providerId">
              <div class="relative">
                <img :alt="service.name" class="w-full h-[200px] object-cover"
                  :src="service.medias?.link || '/placeholder-image.jpg'" />
                <div v-if="service.sponsored"
                  class="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Sponsorisé
                </div>
              </div>
              <div class="p-4 bg-slate-900 text-white">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <img :alt="service.name" class="w-10 h-10 rounded-full object-cover mr-3 border-2 border-gold"
                      :src="service.medias?.link || '/placeholder-image.jpg'" />

                    <p class="font-semibold text-white truncate text-[16px]">
                      {{ service.enterpriceName.slice(0, 10) + "..." }}
                    </p>
                  </div>
                  <div class="flex justify-between items-center">
                    <div class="flex items-center mt-1">
                      <BadgeCheck class="text-gold h-4 w-4 mr-1" v-if="service.verified" />
                      <Star class="text-gold h-4 w-4" />
                      <span class="ml-1 text-sm text-gold">{{
                        service.rating
                      }}</span>
                      <span class="ml-1 text-xs text-gray-400">({{ service.reviews }})</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <h3 class="text-[13px] font-medium truncate">
                      {{ service.name.slice(0, 258) + "..." }}
                    </h3>
                    <div class="flex items-center text-sm text-gold">
                      <Clock class="h-4 w-4 mr-1" />
                      {{ service.duration }} min
                    </div>
                  </div>

                  <div class="flex justify-between items-center">
                    <span class="text-sm px-2 py-1 rounded-full" :class="service.served_at_home
                        ? 'bg-gray-700 text-gold'
                        : 'bg-gray-700 text-gold'
                      ">
                      {{
                        service.served_at_home ? "À domicile" : "En institut"
                      }}
                    </span>
                    <span class="font-bold text-gold text-sm">{{ service.price }} Fcfa</span>
                  </div>
                </div>

                <button @click="addToCart(service)"
                  class="mt-4 w-full bg-gold hover:bg-yellow-golden text-slate-900 font-medium py-2 px-4 rounded-full flex items-center justify-center transition-colors">
                  <CalendarPlus2 class="mr-2 h-4 w-4" />
                  <span>Réserver</span>
                </button>
              </div>
            </article>
          </div>
          <!-- Pagination API -->
          <div class="flex justify-center mt-8" v-if="pagination?.last_page > 1">
            <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <!-- Bouton Précédent -->
              <button @click="goToPage(currentPage - 1)" :disabled="!pagination?.prev_page_url"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Précédent</span>
                &laquo; Précédent
              </button>

              <!-- Numéros de page -->
              <button v-for="page in pagination?.last_page" :key="page" @click="goToPage(page)" :class="{
                'bg-gold text-slate-900': currentPage === page,
                'bg-white text-gray-500 hover:bg-gray-50':
                  currentPage !== page,
              }" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium">
                {{ page }}
              </button>

              <!-- Bouton Suivant -->
              <button @click="goToPage(currentPage + 1)" :disabled="!pagination?.next_page_url"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Suivant</span>
                Suivant &raquo;
              </button>
            </nav>
          </div>
        </section>
        <div v-else class="text-center mt-20 mb-8">
          Aucun service disponible
        </div>
      </div>
      <div v-else class="text-center mt-20 mb-8">Aucune donnée disponible</div>
    </div>

    <!-- Modal de réservation -->
  </div>
</template>

<style>
.h-200px {
  height: 200px;
}
</style>
