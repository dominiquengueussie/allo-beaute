<script setup>
import {
  ArrowBigLeft,
  Search,
  Hourglass,
  CheckCheck,
  Clock8,
  HandCoins,
  PhoneCall,
  Bell,
  Eye,
  ClockFading,
  CalendarClock,
  Plus,
  Check,
  CalendarDays,
  List,
  Euro,
  ChevronDown,
  Grid,
  Flame,
  Hand,
  Sparkles,
  Scissors,
  ArrowDownNarrowWide,
  SquarePen,
  Trash2,
  ConciergeBell,
  TriangleAlert,
  ChevronRight,
  ChevronLeft,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";
const toast = useToast();
// User avatar
const userAvatar =
  "https://readdy.ai/api/search-image?query=professional%25252520portrait%25252520of%25252520a%25252520beautiful%25252520young%25252520French%25252520woman%25252520with%25252520short%25252520brown%25252520hair%2525252C%25252520warm%25252520smile%2525252C%25252520natural%25252520makeup%2525252C%25252520beauty%25252520salon%25252520owner%2525252C%25252520professional%25252520headshot%2525252C%25252520neutral%25252520background%2525252C%25252520high%25252520quality%2525252C%25252520photorealistic&width=200&height=200&seq=1&orientation=squarish";
// State variables
const searchQuery = ref("");
const dateFilter = ref("all");
const selectedDate = ref("");
const openDropdown = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showAppointmentModal = ref(false);
const auth = useAuthStore();
const user= auth.getUser();
const role = computed(() => user?.role);
const token = auth.getToken();
// Fetch appointments
const appointments = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchAppointments = async () => {
  try {
    loading.value = true;
    const { data, error: fetchError } = await useFetch(
      "https://demo-allobeaute.tikaplace.com/api/reservations",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        transform: (response) => {
          // Vérification sécurisée pour éviter les erreurs si la structure de la réponse change.
          // Si response.data ou response.data.my n'existent pas, on retourne un tableau vide.
          return response?.data?.my || [];
        },
      }
    );
    appointments.value = data.value || [];
    console.log("Rendez-vous chargés:", appointments.value);
    if (fetchError.value) {
      throw fetchError.value;
    }
  } catch (err) {
    error.value = err;
    toast.error("Erreur lors du chargement des rendez-vous.");
  } finally {
    loading.value = false;
  }
};
onMounted(async () => {
  setTimeout(async () => {
    await fetchAppointments();
  }, 100);
});

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};
// Format date with time
const formatDateWithTime = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
// Open appointment details modal
const openAppointmentDetails = async (appointment) => {
  navigateTo(`/reservation/${appointment.id}`);
};

const getNotifications = () =>{
  toast.info('Fonctionnalité à venir !');
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Main Content -->
    <div class="ml-64 flex-1">
      <!-- Header -->
      <header
        class="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-5"
      >
        <div class="flex items-center">
          <div class="relative">
           <!--  <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un rendez-vous..."
              class="pl-10 pr-4 py-2 border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            />
            <Search class="absolute left-3 top-2.5 text-gray-400 h-4 w-4" /> -->
            <NuxtLink to="/"
          class="text-slate-600 hover:text-slate-900 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap flex items-center">
          <ArrowBigLeft class="w-4 h-4 mr-1" />
          Retour à l'accueil
        </NuxtLink>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative" @click="getNotifications()">
            <button
              class="text-gray-500 hover:text-slate-800 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
            >
              <Bell class="text-xl" />
              <span
                class="absolute -top-1 -right-1 bg-slate-900 text-gold text-xs rounded-full h-4 w-4 flex items-center justify-center"
                >3</span
              >
            </button>
          </div>
          <div class="flex items-center space-x-3 cursor-pointer">
            <div class="w-10 h-10 rounded-full overflow-hidden">
              <img
                :src="userAvatar"
                alt="Avatar utilisateur"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
             <p class="font-medium text-sm">{{ auth.getUser()?.name }}</p>
            <p class="text-xs text-gray-500">{{ auth.getUser()?.enterprise?.type || "Utilisateur"  }}</p>
            </div>
          </div>
        </div>
      </header>
      <!-- Appointments Content -->
      <main class="p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              Historique de vos Rendez-vous
            </h1>
            <p class="text-gray-600">Gérez vos rendez-vous pris récemment.</p>
          </div>
          <NuxtLink
            v-if="role === 'Prestataire'"
            to="/create-service"
            class="bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
          >
            <Plus class="mr-2" /> Ajouter un service
          </NuxtLink>
        </div>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8 mt-16">
          <div class="overflow-x-auto">
            <div v-if="loading" class="text-center text-gray-500">
              <TableSkeleton />
            </div>

            <div v-else-if="error" class="text-center text-red-500">
              ❌ Erreur : Une erreur s'est produite lors du chargement des rendez-vous.
            </div>
            <div
              v-else-if="appointments.length === 0"
              class="py-12 text-center"
            >
              <div class="mb-2 text-gray-400 flex justify-center">
                <CalendarClock class="text-5xl" />
              </div>
              <h3 class="text-xl font-medium text-gray-800 mb-2">
                Aucun rendez-vous trouvé
              </h3>
            </div>
            <table v-else class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date & Heure
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Entreprise
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Téléphone
                  </th>

                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Durée
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Prix
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  @click="openAppointmentDetails(appointment)"
                  v-for="appointment in appointments"
                  :key="appointment.id"
                  class="hover:bg-gray-50 cursor-pointer"
                >
                  <!-- Date & Heure -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ new Date(appointment.date).toLocaleDateString() }} à
                    </div>
                    <div class="text-sm text-gray-500">
                      {{
                        new Date(appointment.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }}
                    </div>
                  </td>
                  <!-- Service (ici enterprise name) -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      {{ appointment.enterprise?.name }}
                    </div>
                  </td>

                  <!-- Client -->
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm text-gray-500">
                          {{ appointment.enterprise?.phone || "—" }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <!-- Durée -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ appointment.duration }} min
                    </div>
                  </td>

                  <!-- Prix -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ appointment.price }} Fcfa
                    </div>
                  </td>

                  <!-- Statut -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : appointment.status === 'canceled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800',
                      ]"
                    >
                      {{
                        appointment.status === "pending"
                          ? "En attente"
                          : appointment.status === "confirmed"
                          ? "Confirmé"
                          : appointment.status === "completed"
                          ? "Terminé"
                          : appointment.status === "canceled"
                          ? "Annulé"
                          : "Inconnu"
                      }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <div class="flex justify-end space-x-2" @click.stop>
                   <!--    <button
                        class="text-green-600 hover:text-green-900 cursor-pointer"
                        title="Confirmer"
                      >
                        <Check class="h-5 w-5" />
                      </button>
                      <button
                        class="text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="Reporter"
                      >
                        <CalendarDays class="h-5 w-5" />
                      </button>
                      <button
                        class="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Annuler"
                      >
                        <ClockFading class="h-5 w-5" />
                      </button> -->
                      <button
                        @click="openAppointmentDetails(appointment)"
                        class="text-gray-600 hover:text-pink-600 cursor-pointer"
                        title="Détails"
                      >
                        <Eye class="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div
            v-if="appointments.length > 0"
            class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
          >
            <div
              class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p class="text-sm text-gray-700">
                  Affichage de
                  <span class="font-medium">{{ paginationStart }}</span> à
                  <span class="font-medium">{{ paginationEnd }}</span> sur
                  <span class="font-medium">{{ appointments.length }}</span>
                  rendez-vous
                </p>
              </div>
              <div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    @click="currentPage > 1 ? currentPage-- : null"
                    :disabled="currentPage === 1"
                    :class="[
                      'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50 cursor-pointer',
                    ]"
                  >
                    <span class="sr-only">Précédent</span>
                    <ChevronLeft />
                  </button>
                  <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      currentPage === page
                        ? 'z-10 bg-pink-50 border-pink-500 text-pink-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="currentPage < totalPages ? currentPage++ : null"
                    :disabled="currentPage === totalPages"
                    :class="[
                      'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50 cursor-pointer',
                    ]"
                  >
                    <span class="sr-only">Suivant</span>
                    <ChevronRight />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

/* Remove number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
