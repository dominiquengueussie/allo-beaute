<script setup>
definePageMeta({
    layout: "dashboard",
});
import { useToast } from "vue-toastification";
const toast = useToast();
import {
    CalendarDays,
    Clock8,
    Phone,
    HandCoins,
    PhoneCall,
    ConciergeBell,
    Hourglass,
    TriangleAlert,
    ClockFading,
    RefreshCcwDotIcon,
    Loader2,
} from "lucide-vue-next";

const showRescheduleModal = ref(false);
const showCancelModal = ref(false);
const cancelReason = ref("");
const route = useRoute();
const bookedId = route.params.id;
const auth = useAuthStore();
const token = auth.getToken();
const bookingDetails = ref(null);
const isRetryingPayment = ref(false);
const phoneNumber = ref("");
const paymentId = ref(null);
const isProcessingPayment = ref(false);
const paymentStatus = ref(null);
const paymentPollingInterval = ref(null);
const showPaymentModal = ref(false);
const reservation_id = ref(null);

// Récupération des détails de la réservation avec useFetch
const fetchBookingDetails = async () => {
    try {
        const response = await $fetch(
            `https://demo-allobeaute.tikaplace.com/api/reservations/${bookedId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        bookingDetails.value = response.data;
        reservation_id.value = response.data.id;
        paymentId.value = response.data.payments[0].id;
    } catch (error) {
        console.error("Erreur API:", error.data || error.message);
    }
};

onMounted(() => {
    fetchBookingDetails();
});

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
};
// Save notes
const saveNotes = () => {
    toast.success("Note enregistré avec succès");
};
// Open add appointment modal
const openAddAppointmentModal = () => {
    navigateTo("/create-service");
};

// Update service details when service is selected
const updateServiceDetails = () => { };

// Open reschedule modal
const openRescheduleModal = (appointment) => { };
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
const cancelAppointment = (serviceBookedId) => {
    try {
        const {
            data: response,
            status,
            error,
        } = useFetch(
            "https://demo-allobeaute.tikaplace.com/api/reservations/cancel",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    reservation_id: serviceBookedId,
                    //reason: cancelReason.value
                },
            }
        );
        if (error.value) {
            toast.error("Erreur lors de l'annulation du rendez-vous");
            return;
        } else {
            bookingDetails.value = null; // Clear booking details after cancellation
            showCancelModal.value = false;
            cancelReason.value = ""; // Reset cancel reason
            toast.success("Rendez-vous annulé avec succès");
            return;
        }
    } catch (error) {
        console.error("Erreur API:", error.data || error.message);
    }
    toast.success("Rendez-vous annulé avec succès");
    closeCancelModal();
    navigateTo("/dashboard/booked-services");
};
// Confirm appointment
const retryAppointment = async () => {
     if (phoneNumber.value.replace(/\s/g, "").length !== 9) {
    toast.error("Veuillez saisir un numéro de téléphone valide.");
    return;
  }
  isProcessingPayment.value = true;
  isRetryingPayment.value = true;

  // initialisation du paiement
  try {
    const { data, error } = await useFetch(
      "https://demo-allobeaute.tikaplace.com/api/reservations/pay",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: {
          reservation_id: reservation_id.value,
          number: "237" + phoneNumber.value,
          //payment_method: paymentInfo.paymentMethod,
        },
      }
    );

    if (error.value) {
      throw error.value;
    }

    // vérification de la réponse
    if (data.value?.status === "success") {
      showPaymentModal.value = true;

      // Lancement du polling pour vérifier le statut
      const paymentId = data.value.data.payment.id;
      startPaymentStatusPolling(paymentId);
    } else {
      throw new Error(
        data.value?.message || "Erreur lors de l'initiation du paiement"
      );
    }
  } catch (err) {
    console.error("Payment error:", err);
    toast.error(err.message || "Erreur lors du traitement du paiement");
    isProcessingPayment.value = false;
  }finally {
        isRetryingPayment.value = false;
    } 
};

const startPaymentStatusPolling = (paymentId) => {
  // Arrêt d'un éventuel polling précédent
  if (paymentPollingInterval.value) {
    clearInterval(paymentPollingInterval.value);
  }
  paymentPollingInterval.value = setInterval(async () => {
    try {
      const { data } = await useFetch(
        `https://demo-allobeaute.tikaplace.com/api/payments/${paymentId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.value?.data?.status === "success") {
        clearInterval(paymentPollingInterval.value);
        paymentStatus.value = "success";
        isProcessingPayment.value = false;
        toast.success("Merci pour votre paiement !");
        // Redirection ou autre action après succès
        navigateTo("/reservation/success");
      } else if (data.value?.data?.status === "failed") {
        clearInterval(paymentPollingInterval.value);
        showPaymentModal.value = false;
        paymentStatus.value = "failed";
        isProcessingPayment.value = false;
        toast.error("Paiement échoué - Veuillez réessayer");
      }
      // Sinon, le statut reste "initiated" et on continue le polling
    } catch (err) {
      console.error("Polling error:", err);
      clearInterval(paymentPollingInterval.value);
      isProcessingPayment.value = false;
    }
  }, 5000); // Vérification toutes les 5 secondes
};

// Nettoyage lorsque le composant est démonté
onUnmounted(() => {
  if (paymentPollingInterval.value) {
    clearInterval(paymentPollingInterval.value);
  }
});
// Complete appointment
const completeAppointment = (appointment) => { };

const filterNumericInput = (event) => {
  // Remplace tout ce qui n'est pas un chiffre par une chaîne vide
  phoneNumber.value = (event.target).value.replace(/[^0-9]/g, '');
};
</script>

<template>
    <div>
        <!-- Appointment Details Modal -->
        <div class="fixed inset-0 flex items-center justify-center p-7 ml-10">
            <div class="bg-white rounded-md border border-gray-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                @click.stop>
                <div class="p-6 border-b flex justify-between items-center">
                    <h2 class="text-md md:text-xl font-bold text-gray-800">
                        Détails de votre rendez-vous
                    </h2>
                </div>
                <div class="p-6">
                    <div class="flex flex-col md:flex-row md:space-x-6">
                        <div class="md:w-1/3 mb-6 md:mb-0">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <div class="flex items-center mb-4">
                                    <div class="h-16 w-16 rounded-full overflow-hidden mr-4">
                                        <img src="https://cdn-icons-png.flaticon.com/128/17932/17932534.png"
                                            alt="Client" class="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h6 class="font-bold text-sm">
                                            {{ bookingDetails?.user?.name }}
                                        </h6>
                                        <p class="text-gray-600 text-sm">
                                            {{ bookingDetails?.user?.email || "Non disponible" }}
                                        </p>
                                    </div>
                                </div>
                                <div class="space-y-3">
                                    <div class="flex items-start">
                                        <PhoneCall class="text-gray-400 mt-1 w-5" />
                                        <div class="ml-2">
                                            <p class="text-sm font-medium">Téléphone</p>
                                            <p class="text-sm text-gray-600">
                                                {{
                                                    bookingDetails?.user?.phone_number || "Non disponible"
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <CalendarDays class="text-gray-400 mt-1 w-5" />
                                        <div class="ml-2">
                                            <p class="text-sm font-medium">Date</p>
                                            <p class="text-sm text-gray-600">
                                                {{
                                                    formatDate(bookingDetails?.date) || "Nondisponible"
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <Clock8 class="text-gray-400 mt-1 w-5" />
                                        <div class="ml-2">
                                            <p class="text-sm font-medium">Heure</p>
                                            <p class="text-sm text-gray-600">
                                                {{ bookingDetails?.start_time || "Non disponible" }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <ConciergeBell class="text-gray-400 mt-1 w-5" />
                                        <div class="ml-2">
                                            <p class="text-sm font-medium">Service</p>
                                            <p class="text-sm text-gray-600">
                                                {{
                                                    bookingDetails?.reservation_services[0]?.service
                                                        ?.name || "Non disponible"
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <Hourglass class="text-gray-400 mt-1 w-5" />
                                        <div class="ml-2">
                                            <p class="text-sm font-medium">Durée</p>
                                            <p class="text-sm text-gray-600">
                                                {{ bookingDetails?.duration || "Non disponible" }}
                                                minutes
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <HandCoins class="text-gray-400 mt-1 w-5" />
                                        <div class="ml-2">
                                            <p class="text-sm font-medium">Prix</p>
                                            <p class="text-sm text-gray-600">
                                                {{ bookingDetails?.price || "Non disponible" }} Fcfa
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="md:w-2/3">
                            <div class="mb-6">
                                <div class="flex justify-between items-center mb-2">
                                    <h3 class="font-bold text-lg">Statut</h3>
                                    <span :class="[
                                        'px-3 py-1 text-sm rounded-full font-medium',
                                        bookingDetails?.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : bookingDetails?.status === 'confirmed'
                                                ? 'bg-green-100 text-green-800'
                                                : bookingDetails?.status === 'canceled'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-600',
                                    ]">
                                        {{
                                            bookingDetails?.status === "pending"
                                                ? "En attente"
                                                : bookingDetails?.status === "confirmed"
                                                    ? "Confirmé"
                                                    : bookingDetails?.status === "canceled"
                                                        ? "Annulé"
                                                        : bookingDetails?.status === "completed"
                                        ? "Terminé"
                                        : "Non disponible"
                                        }}
                                    </span>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-center justify-between mb-4">
                                        <h4 class="font-medium">Historique des modifications</h4>
                                    </div>
                                    <div class="space-y-3">
                                        <div class="flex items-start">
                                            <div class="flex-shrink-0 mt-1">
                                                <span :class="[
                                                    'w-8 h-8 rounded-full flex items-center justify-center',
                                                    'bg-gray-100 text-gray-600',
                                                ]">
                                                    <CalendarDays class="w-5 h-5 text-gray-600" />
                                                </span>
                                            </div>
                                            <div class="ml-3">
                                                <p class="text-sm font-medium">Rendez-vous prit le</p>
                                                <p class="text-xs text-gray-500">
                                                    {{
                                                        formatDate(bookingDetails?.date) || "Non disponible"
                                                    }}
                                                    à
                                                    <span class="text-sm text-gray-600 mt-1">{{
                                                        bookingDetails?.time || "non disponible"
                                                        }}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="flex items-start">
                                            <div class="flex-shrink-0 mt-1">
                                                <span :class="[
                                                    'w-8 h-8 rounded-full flex items-center justify-center',
                                                    'bg-gray-100 text-gray-600',
                                                ]">
                                                    <Clock8 class="w-5 h-5 text-gray-600" />
                                                </span>
                                            </div>
                                            <div class="ml-3">
                                                <p class="text-sm font-medium">Heure de début</p>
                                                <p class="text-xs text-gray-500">
                                                    à
                                                    <span class="text-sm text-gray-600 mt-1">{{
                                                        bookingDetails?.start_time || "non disponible"
                                                        }}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="flex items-start">
                                            <div class="flex-shrink-0 mt-1">
                                                <span :class="[
                                                    'w-8 h-8 rounded-full flex items-center justify-center',
                                                    'bg-gray-100 text-gray-600',
                                                ]">
                                                    <ClockFading class="w-5 h-5 text-gray-600" />
                                                </span>
                                            </div>
                                            <div class="ml-3">
                                                <p class="text-sm font-medium">Heure de fin</p>
                                                <p class="text-xs text-gray-500">
                                                    à
                                                    <span class="text-sm text-gray-600 mt-1">{{
                                                        bookingDetails?.end_time || "non disponible"
                                                        }}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--   <div class="mb-6">
                                <h3 class="font-bold text-lg mb-2">Notes</h3>
                                <textarea v-model="appointmentNotes" rows="3"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 text-sm"
                                    placeholder="Ajouter des notes concernant ce rendez-vous..."></textarea>
                                <div class="flex justify-end mt-2">
                                    <button @click="saveNotes"
                                        class="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                        Enregistrer les notes
                                    </button>
                                </div>
                            </div> -->
                            <div class="border-t pt-6 flex flex-wrap gap-3">
                            </div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                            <div class="border-l-4 border-yellow-400 p-4 rounded-r-lg bg-yellow-50" v-if="
                                     bookingDetails?.status === 'pending' ||
                                     bookingDetails?.status === 'canceled'">
                                <h4 class="font-semibold text-yellow-800 mb-3 flex items-center">
                                    <AlertTriangle class="w-5 h-5" />Action requise
                                </h4>
                                <div>
                                    <label for="phone-retry" class="block text-sm font-medium text-gray-700 mb-1">Numéro
                                        de téléphone pour le paiement</label>
                                    <div class="relative">
                                        <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input type="tel" id="phone-retry" v-model="phoneNumber"
                                            @input="filterNumericInput" placeholder="Ex: 690123456"
                                            class="w-full pl-10 pr-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-gold focus:border-gold text-sm" />
                                    </div>
                                </div>
                                 <div class="mt-4 flex flex-wrap gap-3">
                                     <button v-if="
                                     bookingDetails?.status === 'pending' ||
                                     bookingDetails?.status === 'canceled'
                                " @click="retryAppointment(bookedId)" :disabled="isRetryingPayment"
                                    class="bg-slate-700 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Loader2 v-if="isRetryingPayment" class="animate-spin mr-2 h-5 w-5" />
                                    <RefreshCcwDotIcon v-else class="mr-2 h-5 w-5" />
                                    {{
                                        isRetryingPayment ? "En cours..." : "Relancer le paiement"
                                    }}
                                </button>
                                <!--  <button
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                    <CheckCheck class="mr-2" /> Marquer comme terminé
                                </button>
                                <button
                                    class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                    <CalendarDays class="mr-2" /> Reporter
                                </button> -->
                                <button v-if="bookingDetails?.status === 'pending'" @click="openCancelModal"
                                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                    <ClockFading class="mr-2 h-5 w-5" /> Annuler
                                </button>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Reschedule Modal -->
        <div v-if="showRescheduleModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md" @click.stop>
                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold text-gray-800">
                        Reporter le rendez-vous
                    </h2>
                </div>
                <div class="p-6">
                    <form @submit.prevent="rescheduleAppointment">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nouvelle date</label>
                            <input type="date" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm" />
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nouvelle heure</label>
                            <input type="time" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm" />
                        </div>
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Raison du report</label>
                            <textarea rows="3"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                placeholder="Indiquez la raison du report..."></textarea>
                        </div>
                        <div class="flex justify-end space-x-3">
                            <button type="button" @click="closeRescheduleModal"
                                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                Annuler
                            </button>
                            <button type="submit"
                                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                Confirmer le report
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- Cancel Modal -->
        <div v-if="showCancelModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md" @click.stop>
                <div class="p-6">
                    <div class="text-center mb-6">
                        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
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
                        <label class="block text-sm font-medium text-gray-700 mb-2">Raison de l'annulation</label>
                        <textarea v-model="cancelReason" rows="3"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                            placeholder="Indiquez la raison de l'annulation..."></textarea>
                    </div>
                    <div class="flex justify-center space-x-3">
                        <button @click="closeCancelModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            Retour
                        </button>
                        <button @click="cancelAppointment(bookedId)"
                            class="px-4 py-2 bg-slate-600 hover:bg-slate-900 text-white rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            Confirmer l'annulation
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <PaymentModalUssd :isOpen="showPaymentModal" @close="showPaymentModal = false" />
    </div>
</template>
