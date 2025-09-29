<script setup>
import { useToast } from "vue-toastification";
import { Loader } from "lucide-vue-next";

const toast = useToast();
const isSubmitting = ref(false);
const props = defineProps({
  serviceCart: Array,
  selectedDate: Date,
  selectedTimes: Array,
});
const emit = defineEmits(["select-date", "select-time"]);
const showTooltip = ref(false);
const tooltipDayIndex = ref(-1);
const selectedTime = ref(null);
// Noms des jours et mois
const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]; // Dimanche en premier
const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// Header du calendrier avec mois et année
const currentHeader = computed(() => {
  const today = new Date();
  return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
});

const isSelectedDate = (date) => {
  //console.log("Selected date:", date);
  if (!props.selectedDate) return false;
  const selected = new Date(props.selectedDate);
  selected.setHours(0, 0, 0, 0);
  const comparing = new Date(date);
  comparing.setHours(0, 0, 0, 0);
  return selected.getTime() === comparing.getTime();
};

const getUnavailabilityReason = () => {
  return "Cette date n'est pas disponible";
};

const showUnavailableMessage = (day) => {
  if (!day.isAvailable) {
    tooltipDayIndex.value = next7Days.value.findIndex(
      (d) => d.date.getTime() === day.date.getTime()
    );
    showTooltip.value = true;
    setTimeout(() => {
      showTooltip.value = false;
      tooltipDayIndex.value = -1;
    }, 2000);
  }
};

// Calcul des 7 prochains jours à partir de demain
const next7Days = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    // Commence à 0 au lieu de 1 pour inclure aujourd'hui
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    days.push({
      date,
      dayNumber: date.getDate(),
      dayName: weekDays[date.getDay()],
      month: monthNames[date.getMonth()],
      isToday: i === 0, // Marque le premier jour comme "aujourd'hui"
      isAvailable: true,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }

  return days;
});
const apiResponse = ref(null);
const getSchedule = async (date) => {
  isSubmitting.value = true;
  emit("select-date", date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Mois commence à 0
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  const services = props.serviceCart.map((service) => ({
    id: service.id,
    quantity: service.quantity || 1,
  }));

  if (!services.length || services.some((s) => !s.id)) {
    toast.error(
      "Erreur : serviceCart vide ou identifiants manquants",
      services
    );
    return;
  }

  const payload = {
    date: formattedDate,
    services,
  };

  const enterpriseId = props.serviceCart[0]?.enterpriseId || null;
  if (!enterpriseId) {
    toast.error("Erreur : enterpriseId manquant");
    return;
  }

  const apiEndpoint = `https://demo-allobeaute.tikaplace.com/api/enterprises/${enterpriseId}/availability/slots`;

  const { data, status, error } = await useFetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  //console.log(data.value);
  if (status.value === "success" && data.value) {
    apiResponse.value = data.value;
    isSubmitting.value = false;
    selectedTime.value = null;
  } else if (error.value) {
    toast.error("Erreur lors de l'affichage des horaires:", error.value);
  }
  return apiResponse.value;
};
//Fonction pour gérer la sélection d’un créneau
const selectSlot = (startTime) => {
  selectedTime.value = startTime; // Mettre à jour le créneau sélectionné
  emit("select-time", startTime); // Émettre uniquement start_time
};
</script>

<template>
  <div>
    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div class="bg-slate-600 px-6 py-4">
        <h3 class="text-xl font-semibold text-white">Choisir une Date, ensuite, une heure</h3>
      </div>
      <div class="p-6">
        <div class="mb-6">
          <!-- En-tête avec mois et année -->
          <div class="text-center mb-4">
            <h4 class="text-lg font-medium text-gray-800">
              {{ currentHeader }}
            </h4>
          </div>

          <!-- Jours de la semaine -->
          <!--   <div class="grid grid-cols-7 gap-1 text-center mb-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="py-2 text-sm font-medium text-gray-600"
            >
              {{ day }}
            </div>
          </div> -->

          <!-- Dates -->
          <div class="grid grid-cols-7 gap-1">
            <!-- Trouver le jour de la semaine de la première date (demain) -->
            <!--     <template
              v-for="n in next7Days[0]?.date.getDay()"
              :key="'empty-' + n"
            >
              <div class="py-2 text-center opacity-0">0</div>
            </template> -->

            <!-- Afficher les 7 prochains jours -->
            <div v-for="(day, index) in next7Days" :key="index" :class="[
              'py-2 text-center rounded-md cursor-pointer transition-colors relative group',
              day.isWeekend ? 'bg-purple-50' : '',
              {
                'bg-slate-600 text-white': isSelectedDate(day.date),
                'bg-blue-100': day.isToday && !isSelectedDate(day.date),
                'hover:bg-gray-400':
                  !isSelectedDate(day.date) && !day.isToday,
              },
            ]" @click="getSchedule(day.date)">
              <div class="text-sm">{{ day.dayName }}
              </div>
              <div class="font-medium">{{ day.dayNumber }}</div>
              <span v-if="day.isToday" class="text-[8px] md:block text-gold hidden">Aujourd'hui</span>
              <div v-if="
                !day.isAvailable && showTooltip && tooltipDayIndex === index
              "
                class="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {{ getUnavailabilityReason() }}
                <div
                  class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sélection des horaires -->
        <div v-if="selectedDate">
          <div class="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
            <p class="text-lg font-medium text-gray-800 flex mx-2 items-center mb-4">
              <Component :is="isSubmitting ? Loader : Save" class="mr-2 w-5 h-5"
                :class="{ 'animate-spin': isSubmitting }" />
              <span>{{
                isSubmitting ? "Chargement en cours..." : "Horaires disponibles"
              }}</span>
            </p>
            <div class="grid grid-cols-4 gap-2" v-if="!isSubmitting">
              <div v-if="!apiResponse?.data?.slots || apiResponse.data.slots.length === 0"
                class="col-span-4 text-center text-gray-500">
                Aucune plage horaire disponible pour cette date.
              </div>
              <button v-for="(slot, slotIndex) in apiResponse?.data?.slots" :key="`${slot.start_time}-${slot.end_time}`"
                :class="[
                  'py-2 text-[10px] md:text-[12px] rounded-button whitespace-nowrap cursor-pointer border',
                  selectedTime === slot.start_time
                    ? 'bg-slate-600 text-white border-slate-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400',
                ]" @click="selectSlot(slot.start_time)">
                {{ `${slot.start_time}-${slot.end_time}` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
