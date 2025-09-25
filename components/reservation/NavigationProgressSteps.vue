<script setup>
const token = useAuthStore().token;
import { useToast } from "vue-toastification";
const toast = useToast();
const reservation_id = ref(null);
const { serviceCart, serviceTotal } = useCart();
const contactInfo = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
  marketing: false,
});
const selectedDate = ref(null);
const selectedTimes = ref([]);
const termsAccepted = ref(false);
const showPaymentMethod = ref(false);
const phoneNumber = ref("");
const paymentMethodId = ref("");
const paymentStatus = ref(null);
const paymentPollingInterval = ref(null);
const isProcessingPayment = ref(false);
const showPaymentModal = ref(false);

const updateMarketing = (value) => {
  contactInfo.value.marketing = value;
};

const isFormValid = computed(() => {
  return (
    serviceCart.value.length > 0 &&
    selectedDate.value &&
    selectedTimes.value.length > 0 &&
    termsAccepted.value === true
  );
  /* const contactFilled = contactInfo.value.firstName.trim() !== '' &&
        contactInfo.value.lastName.trim() !== '' &&
        contactInfo.value.email.trim() !== '' &&
        contactInfo.value.phone.trim() !== '';
        contactInfo.value.email.includes(['@' , '.com']) */
  //contactInfo.value.phone.trim().length <= 13 && contactInfo.value.phone.trim().length >= 9;
});

const selectDate = (date) => {
  selectedDate.value = new Date(date);
  selectedTimes.value = Array(serviceCart.value.length).fill("");
  //console.log("date emitted:", selectedDate.value);
};

const selectTime = (startTime) => {
  selectedTimes.value = startTime;
};

// Fonction pour formater la date au format YYYY-MM-DD HH:mm
const formatDateTime = (date, time) => {
  const d = new Date(date);
  const [hours, minutes] = time.split(":");
  d.setHours(hours, minutes, 0, 0);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Mois commence à 0
  const day = String(d.getDate()).padStart(2, "0");
  const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  return `${year}-${month}-${day} ${formattedTime}:00`;
};

const handlePaymentInfo = async (paymentInfo) => {
  if (paymentInfo.phoneNumber.replace(/\s/g, "").length !== 9) {
    toast.error("Veuillez saisir un numéro de téléphone valide.");
    return;
  }
  isProcessingPayment.value = true;
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
          number: "237" + paymentInfo.phoneNumber,
          payment_method: paymentInfo.paymentMethod,
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
  }
};

// Fonction pour vérifier périodiquement le statut
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

const submitReservation = async () => {
  if (!isFormValid.value) return;

  const payload = {
    start_datetime: formatDateTime(selectedDate.value, selectedTimes.value),
    served_at_home: contactInfo.value.marketing, // Prend la valeur du premier service
    address: serviceCart.value[0]?.adress || "", // Note : "adress" semble être une faute de frappe
    services: serviceCart.value.map((service) => ({
      id: service.id,
      quantity: service.quantity,
      supplements: [], // Ajoutez des suppléments si disponibles
    })),
  };

  try {
    const { data, status, error } = await useFetch(
      "https://demo-allobeaute.tikaplace.com/api/reservations/store",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );
    if (error.value) {
      if (error.value.data?.errors) {
        const errorMessages = Object.values(error.value.data.errors).flat();
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.value.data?.message || "Une erreur est survenue");
        showPaymentModal.value = false;
      }
    } else if (data.value) {
      reservation_id.value = data.value.data.id;
      showPaymentMethod.value = true;
    }
  } catch (error) {
    toast.error("Une erreur est survenue, veuillez réessayer.");
    showPaymentModal.value = false;
  }
};

onMounted(() => {
  const today = new Date();
  if (today.getDay() !== 0) {
    selectedDate.value = today;
  }
});

const showLoading = ref(false);
const handlerLoading = () => {
  showLoading.value = true;
  setTimeout(() => {
    showPaymentMethod.value = false;
    showLoading.value = false;
  }, 1000);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-md fixed w-full top-0 z-50">
      <div
        class="container mx-auto px-6 py-3 flex justify-between items-center"
      >
        <div class="flex items-center">
          <NuxtLink to="/services" class="flex items-center">
            <i class="fas fa-arrow-left text-slate-900 mr-3"></i>
            <span class="text-gray-600">Retour</span>
          </NuxtLink>
        </div>
        <h1
          class="text-2xl font-bold text-slate-900 absolute left-1/2 transform -translate-x-1/2"
        >
          Allô Beauté
        </h1>
        <div class="flex items-center space-x-6">
          <div class="relative cursor-pointer">
            <i class="fas fa-user-circle text-xl text-gray-600"></i>
          </div>
        </div>
      </div>
    </nav>

    <!-- Progress Steps -->
    <div class="container mx-auto px-6 pt-24 pb-6">
      <div class="flex items-center justify-center mb-8">
        <div class="flex items-center">
          <div
            class="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white"
          >
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="h-1 w-16 bg-slate-600"></div>
        </div>
        <div class="flex items-center">
          <div
            class="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white"
          >
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="h-1 w-16 bg-slate-300"></div>
        </div>
        <div class="flex items-center">
          <div
            class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-gray-500"
          >
            <i class="fas fa-check"></i>
          </div>
        </div>
      </div>
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-2">
        Confirmation de Réservation
      </h2>
      <p class="text-center text-gray-600 mb-8">
        Choisissez une date et heure pour vos services et complétez vos
        informations
      </p>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-6 pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-1">
          <ServicesSummary
            :service-cart="serviceCart"
            :selected-times="selectedTimes"
            :selected-date="selectedDate"
            :service-total-price="serviceTotal"
            :contact-info="contactInfo"
            @submit="submitReservation"
            @update:marketing="updateMarketing"
          />
        </div>

        <!-- Right Column -->
        <div class="lg:col-span-2">
          <CalendarTimeSlots
            :service-cart="serviceCart"
            :selected-date="selectedDate"
            :selected-times="selectedTimes"
            @select-date="selectDate"
            @select-time="selectTime"
          />

          <ImportantInfoConfirmation
            v-model:terms-accepted="termsAccepted"
            :is-form-valid="isFormValid"
            @submit="submitReservation"
          />
        </div>
      </div>
    </main>

    <PaymentMethodModal
      v-if="showPaymentMethod"
      @close="showPaymentMethod = false"
      @showLoading="handlerLoading"
      @sendPaymentInfo="handlePaymentInfo"
      :showLoading="showLoading"
    />

    <PaymentModalUssd
      :isOpen="showPaymentModal"
      @close="showPaymentModal = false"
    />
  </div>
</template>
