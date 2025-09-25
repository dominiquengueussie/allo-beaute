<script setup>
import {
  Search,
  X,
  Hourglass,
  CheckCheck,
  Clock8,
  Database,
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
const showAddModal = ref(false);
const showRescheduleModal = ref(false);
const showCancelModal = ref(false);
const appointmentNotes = ref("");
const cancelReason = ref("");

const iconMap = {
  pending: Clock8,
  confirmed: Check,
  completed: Check,
  cancelled: X,
  created: Plus,
  rescheduled: CalendarDays,
};

const auth = useAuthStore();
const token = auth.getToken();
const user = auth.getUser();
console.log("Mon Utilisateur:", user);
console.log("Mon Token:", token);

// Fetch appointments
const appointments = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchAppointments = async () => {
  try {
    loading.value = true;
    const { data, error: fetchError } = await useFetch(
      "https://demo-allobeaute.tikaplace.com/api/reservations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        transform: (response) => {
          return response.data.enterprise || [];
        },
      }
    );
    appointments.value = data.value || [];
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
// Get status text
const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmé";
    case "completed":
      return "Terminé";
    case "cancelled":
      return "Annulé";
    default:
      return status;
  }
};
// Close appointment details modal
const closeAppointmentModal = () => {
  showAppointmentModal.value = false;
};
const openAddAppointmentModal = () => {
  navigateTo("/create-service");
};

// Open reschedule modal
const openRescheduleModal = (appointment) => {};
// Close reschedule modal
const closeRescheduleModal = () => {
  showRescheduleModal.value = false;
};
// Reschedule appointment
const rescheduleAppointment = () => {
  closeRescheduleModal();
};
// Open cancel modal
const openCancelModal = (appointment) => {
  cancelReason.value = "";
  showCancelModal.value = true;
  if (showAppointmentModal.value) {
    showAppointmentModal.value = false;
  }
};
// Close cancel modal
const closeCancelModal = () => {
  showCancelModal.value = false;
};
// Cancel appointment
const cancelAppointment = () => {
  closeCancelModal();
};
// Confirm appointment
const confirmAppointment = (appointment) => {};
// Complete appointment
const completeAppointment = (appointment) => {};
const openAppointmentDetails = async (appointment) => {
  navigateTo(`/reservation/${appointment.id}`);
};

const getNotifications = () => {
  toast.info("Fonctionnalité à venir !");
};
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
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un rendez-vous..."
              class="pl-10 pr-4 py-2 border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            />
            <Search class="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative" @click="getNotifications()">
            <button
              class="text-gray-500 hover:text-slate-900 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
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
              <p class="font-medium text-sm">{{ user?.enterprise?.name }}</p>
              <p class="text-xs text-gray-500">{{  user?.enterprise?.type  }}</p>
            </div>
          </div>
        </div>
      </header>
      <!-- Appointments Content -->
      <main class="p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Rendez-vous reçus</h1>
            <p class="text-gray-600">
              Gérez les rendez-vous pris par vos clients
            </p>
          </div>
          <button
            @click="openAddAppointmentModal"
            class="bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
          >
            <Plus class="mr-2" /> Ajouter un service
          </button>
        </div>
        <!-- View Toggle and Filters 
                <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div class="flex flex-wrap justify-between items-center mb-6">
                        <div class="flex items-center space-x-4">
                            <button
                                class="px-4 py-2 rounded-lg text-sm flex font-medium transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200">
                                <List class="mr-2 h-5 w-5" />
                                Liste
                            </button>
                        </div>
                        <div class="flex space-x-2 mt-4 sm:mt-0">
                            <div class="relative">
                                <button @click="toggleFilterDropdown('date')"
                                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                    <CalendarDays class="mr-2" />
                                    {{ getDateFilterLabel() }}
                                    <ChevronDown class="ml-2 text-xs" />
                                </button>
                                <div v-if="openDropdown === 'date'"
                                    class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 z-10 w-48">
                                    <div class="space-y-2">
                                        <label class="flex items-center cursor-pointer">
                                            <input type="radio" v-model="dateFilter" value="all" class="mr-2" />
                                            <span>Toutes les dates</span>
                                        </label>
                                        <label class="flex items-center cursor-pointer">
                                            <input type="radio" v-model="dateFilter" value="today" class="mr-2" />
                                            <span>Aujourd'hui</span>
                                        </label>
                                        <label class="flex items-center cursor-pointer">
                                            <input type="radio" v-model="dateFilter" value="tomorrow" class="mr-2" />
                                            <span>Demain</span>
                                        </label>
                                        <label class="flex items-center cursor-pointer">
                                            <input type="radio" v-model="dateFilter" value="thisWeek" class="mr-2" />
                                            <span>Cette semaine</span>
                                        </label>
                                        <label class="flex items-center cursor-pointer">
                                            <input type="radio" v-model="dateFilter" value="thisMonth" class="mr-2" />
                                            <span>Ce mois</span>
                                        </label>
                                        <div class="pt-2 border-t mt-2">
                                            <button @click="openDatePicker"
                                                class="text-pink-600 hover:text-pink-700 text-sm flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                                <CalendarDays class="mr-2 h-5 w-5" /> Date spécifique
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="relative">
                                <button @click="toggleFilterDropdown('status')"
                                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                    <ArrowDownWideNarrow class="mr-1 h-5 w-5" />
                                    Statut
                                    <ChevronDown class="ml-2 text-xs h-5 w-5" />
                                </button>
                                <div v-if="openDropdown === 'status'"
                                    class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 z-10 w-48">
                                    <div class="space-y-2">
                                        <label class="flex items-center cursor-pointer">
                                            <input type="checkbox" v-model="statusFilters.all"
                                                @change="toggleAllStatuses" class="mr-2" />
                                            <span>Tous les statuts</span>
                                        </label>
                                        <div class="border-t my-2"></div>
                                        <label class="flex items-center cursor-pointer">
                                            <input type="checkbox" v-model="statusFilters.pending" class="mr-2" />
                                            <span class="flex items-center">
                                                <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                                                En attente
                                            </span>
                                        </label>
                                        <label class="flex items-center cursor-pointer">
                                            <input type="checkbox" v-model="statusFilters.confirmed" class="mr-2" />
                                            <span class="flex items-center">
                                                <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                                Confirmé
                                            </span>
                                        </label>
                                        <label class="flex items-center cursor-pointer">
                                            <input type="checkbox" v-model="statusFilters.completed" class="mr-2" />
                                            <span class="flex items-center">
                                                <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                                Terminé
                                            </span>
                                        </label>
                                        <label class="flex items-center cursor-pointer">
                                            <input type="checkbox" v-model="statusFilters.cancelled" class="mr-2" />
                                            <span class="flex items-center">
                                                <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                                                Annulé
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="relative">
                                <button @click="toggleFilterDropdown('service')"
                                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                    <ConciergeBell class=" mr-2 h-5 w-5" />
                                    Service
                                    <ChevronDown class="ml-2 text-xs h-5 w-5" />
                                </button>
                                <div v-if="openDropdown === 'service'"
                                    class="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 z-10 w-48">
                                    <div class="space-y-2">
                                        <label class="flex items-center cursor-pointer">
                                            <input type="checkbox" v-model="serviceFilters.all"
                                                @change="toggleAllServices" class="mr-2" />
                                            <span>Tous les services</span>
                                        </label>
                                        <div class="border-t my-2"></div>
                                        <label v-for="service in services" :key="service.id"
                                            class="flex items-center cursor-pointer">
                                            <input type="checkbox" v-model="serviceFilters[service.id]" class="mr-2" />
                                            <span>{{ service.name }}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="selectedDate" class="bg-gray-50 p-3 rounded-lg mb-4 flex items-center justify-between">
                        <div class="flex items-center">
                            <CalendarDays class=" text-pink-600 mr-2" />
                            <span>Date sélectionnée:
                                <strong>{{ formatDate(selectedDate) }}</strong></span>
                        </div>
                        <button @click="clearSelectedDate"
                            class="text-gray-500 hover:text-red-600 cursor-pointer !rounded-button whitespace-nowrap">
                            <Clock8 class="h-5 w-5" />
                        </button>
                    </div>
                </div>-->
        <!-- List View -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8 mt-16">
          <div class="overflow-x-auto">
            <div v-if="loading" class="text-center text-gray-500">
              <TableSkeleton />
            </div>

            <div v-else-if="error" class="text-center text-red-500">
              ❌ Erreur : {{ error }}
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
                    Client
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Service
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
                <tr  @click="openAppointmentDetails(appointment)"
                  v-for="appointment in appointments"
                  :key="appointment.id"
                  class="hover:bg-gray-50 cursor-pointer"
                >
                  <!-- Date & Heure -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ new Date(appointment.date).toLocaleDateString() }}
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

                  <!-- Client -->
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div
                        class="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-200"
                      >
                        <img
                          v-if="appointment.user?.avatar"
                          :src="appointment.user.avatar"
                          alt=""
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ appointment.user?.name }}
                          {{ appointment.user?.surname }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ appointment.user?.phone || "—" }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Service (ici enterprise name) -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      {{ appointment.enterprise?.name }}
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
                      <button
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
          <!-- Empty State 
                    <div v-if="filteredAppointments.length === 0" class="py-12 text-center">
                        <div class="mb-4 text-gray-400">
                            <CalendarClock class="text-5xl" />
                        </div>
                        <h3 class="text-xl font-medium text-gray-800 mb-2">
                            Aucun rendez-vous trouvé
                        </h3>
                        <p class="text-gray-600 mb-6">
                            Aucun rendez-vous ne correspond à vos critères de recherche.
                        </p>
                        <button @click="resetFilters"
                            class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            Réinitialiser les filtres
                        </button>
                    </div>-->
          <!-- Pagination 
                    <div v-if="filteredAppointments.length > 0"
                        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p class="text-sm text-gray-700">
                                    Affichage de
                                    <span class="font-medium">{{ paginationStart }}</span> à
                                    <span class="font-medium">{{ paginationEnd }}</span> sur
                                    <span class="font-medium">{{ filteredAppointments.length }}</span>
                                    rendez-vous
                                </p>
                            </div>
                            <div>
                                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                    aria-label="Pagination">
                                    <button @click="currentPage > 1 ? currentPage-- : null"
                                        :disabled="currentPage === 1" :class="[
                                            'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                                            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                                        ]">
                                        <span class="sr-only">Précédent</span>
                                        <ChevronLeft />
                                    </button>
                                    <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                        currentPage === page
                                            ? 'z-10 bg-pink-50 border-pink-500 text-pink-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    ]">
                                        {{ page }}
                                    </button>
                                    <button @click="currentPage < totalPages ? currentPage++ : null"
                                        :disabled="currentPage === totalPages" :class="[
                                            'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                                            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                                        ]">
                                        <span class="sr-only">Suivant</span>
                                        <ChevronRight />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>-->
        </div>
      </main>
    </div>
    <!-- Appointment Details Modal -->
    <div
      v-if="showAppointmentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">
            Détails du rendez-vous
          </h2>
          <button
            @click="closeAppointmentModal"
            class="text-gray-500 hover:text-gray-700 cursor-pointer !rounded-button whitespace-nowrap"
          >
            <X />
          </button>
        </div>
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:space-x-6">
            <div class="md:w-1/3 mb-6 md:mb-0">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center mb-4">
                  <div class="h-16 w-16 rounded-full overflow-hidden mr-4">
                    <img
                      src=""
                      alt="Client"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">{{}}</h3>
                    <p class="text-gray-600 text-sm">{{}}</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-start">
                    <PhoneCall class="text-gray-400 mt-1 w-5" />
                    <div class="ml-2">
                      <p class="text-sm font-medium">Téléphone</p>
                      <p class="text-sm text-gray-600">{{}}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <CalendarDays class="text-gray-400 mt-1 w-5" />
                    <div class="ml-2">
                      <p class="text-sm font-medium">Date</p>
                      <p class="text-sm text-gray-600">{{}}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <Clock8 class="text-gray-400 mt-1 w-5" />
                    <div class="ml-2">
                      <p class="text-sm font-medium">Heure</p>
                      <p class="text-sm text-gray-600">{{}}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <ConciergeBell class="text-gray-400 mt-1 w-5" />
                    <div class="ml-2">
                      <p class="text-sm font-medium">Service</p>
                      <p class="text-sm text-gray-600">{{}}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <Hourglass class="text-gray-400 mt-1 w-5" />
                    <div class="ml-2">
                      <p class="text-sm font-medium">Durée</p>
                      <p class="text-sm text-gray-600">{{}} minutes</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <Euro class="text-gray-400 mt-1 w-5" />
                    <div class="ml-2">
                      <p class="text-sm font-medium">Prix</p>
                      <p class="text-sm text-gray-600">{{}} €</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="md:w-2/3">
              <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                  <h3 class="font-bold text-lg">Statut</h3>
                  <span :class="['px-3 py-1 text-sm rounded-full font-medium']">
                    {{}}
                  </span>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="font-medium">Historique des modifications</h4>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-start">
                      <div class="flex-shrink-0 mt-1">
                        <span
                          :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            'bg-gray-100 text-gray-600',
                          ]"
                        >
                          class="w-5 h-5 text-gray-600" />
                        </span>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium">{{}}</p>
                        <p class="text-xs text-gray-500">{{}}</p>
                        <p class="text-sm text-gray-600 mt-1">{{}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-6">
                <h3 class="font-bold text-lg mb-2">Notes</h3>
                <textarea
                  v-model="appointmentNotes"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                  placeholder="Ajouter des notes concernant ce rendez-vous..."
                ></textarea>
                <div class="flex justify-end mt-2">
                  <button
                    @click="saveNotes"
                    class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    Enregistrer les notes
                  </button>
                </div>
              </div>
              <div class="border-t pt-6 flex flex-wrap gap-3">
                <button
                  @click=""
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
                >
                  <Check /> Confirmer
                </button>
                <button
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
                >
                  <CheckCheck class="mr-2" /> Marquer comme terminé
                </button>
                <button
                  class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
                >
                  <CalendarDays class="mr-2" /> Reporter
                </button>
                <button
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
                >
                  <ClockFading class="mr-2" /> Annuler
                </button>
                <button
                  @click="closeAppointmentModal"
                  class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
                >
                  <Clock8 class="mr-2" /> Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Reschedule Modal -->
    <div
      v-if="showRescheduleModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md" @click.stop>
        <div class="p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">
            Reporter le rendez-vous
          </h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="rescheduleAppointment">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Nouvelle date</label
              >
              <input
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Nouvelle heure</label
              >
              <input
                type="time"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
              />
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Raison du report</label
              >
              <textarea
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                placeholder="Indiquez la raison du report..."
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeRescheduleModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
              >
                Confirmer le report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Cancel Modal -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md" @click.stop>
        <div class="p-6">
          <div class="text-center mb-6">
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4"
            >
              <TriangleAlert class="text-red-600 text-2xl" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Confirmer l'annulation
            </h3>
            <p class="text-gray-600">
              Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action est
              irréversible.
            </p>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Raison de l'annulation</label
            >
            <textarea
              v-model="cancelReason"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
              placeholder="Indiquez la raison de l'annulation..."
            ></textarea>
          </div>
          <div class="flex justify-center space-x-3">
            <button
              @click="closeCancelModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
            >
              Retour
            </button>
            <button
              @click="cancelAppointment"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
            >
              Confirmer l'annulation
            </button>
          </div>
        </div>
      </div>
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
