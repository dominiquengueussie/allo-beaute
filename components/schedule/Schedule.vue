<script setup>
import { Loader, Save } from "lucide-vue-next";
const auth = useAuthStore();
const role = computed(() => auth?.getUser()?.role);
import { useToast } from "vue-toastification";
const toast = useToast();
const enterpriseId = auth?.user?.enterprise?.id;
//console.log("Enterprise ID:", enterpriseId);
const responses = ref([])


// Récupération des horaires de la semaine
const fetchSchedules = async () => {
  const { data: apiResponse, error: apiError } = await useFetch(
    `https://demo-allobeaute.tikaplace.com/api/enterprises/${enterpriseId}/schedules`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (apiError.value) {
    console.error(
      "Erreur lors de la récupération des horaires :",
      apiError.value
    );
    toast.error("Une erreur s'est produite, veuillez réessayer !");
    return;
  }
  responses.value = apiResponse.value?.data ?? [];
};
onMounted( async() => {
  await fetchSchedules();
});

// Récupération des jours de la semaine pour création de emploi de temps
const { data, status, error } = await useFetch(
  "https://demo-allobeaute.tikaplace.com/api/utils/days",
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  }
);
const days = ref([
  {
    id: 1,
    name: "Lundi",
    short: "Lun",
    is_active: true,
    start_time: "00:00",
    end_time: "23:59",
  },
  {
    id: 2,
    name: "Mardi",
    short: "Mar",
    is_active: true,
    start_time: "00:00",
    end_time: "23:59",
  },
  {
    id: 3,
    name: "Mercredi",
    short: "Mer",
    is_active: true,
    start_time: "00:00",
    end_time: "23:59",
  },
  {
    id: 4,
    name: "Jeudi",
    short: "Jeu",
    is_active: true,
    start_time: "00:00",
    end_time: "23:59",
  },
  {
    id: 5,
    name: "Vendredi",
    short: "Ven",
    is_active: true,
    start_time: "00:00",
    end_time: "23:59",
  },
  {
    id: 6,
    name: "Samedi",
    short: "Sam",
    is_active: true,
    start_time: "00:00",
    end_time: "23:59",
  },
  {
    id: 7,
    name: "Dimanche",
    short: "Dim",
    is_active: true,
    start_time: "00:00",
    end_time: "23:59",
  },
]);
if (data.value?.data?.length) {
  days.value = data.value.data.map((apiDay, index) => ({
    id: apiDay.id,
    name: apiDay.day,
    short: apiDay.abbr,
    is_active: days.value[index]?.is_active ?? true,
    start_time: days.value[index]?.start_time ?? "00:00",
    end_time: days.value[index]?.end_time ?? "23:59",
  }));
}
// Calculate gradient for time visualization
const calculateGradient = (start, end) => {
  const startHour = parseInt(start.split(":")[0]);
  const endHour = parseInt(end.split(":")[0]);
  const totalHours = endHour - startHour;
  return Math.min(100, Math.max(0, (totalHours / 24) * 100));
};

// Format time for display
const formatTimeDisplay = (time) => {
  if (time === "00:00" && time === "00:00") return "Ouvert";
  const [hours, minutes] = time.split(":");
  return `${hours}h${minutes !== "00" ? minutes : ""}`;
};

// Adjust time by increment/decrement
const adjustTime = (day, type, change) => {
  const [hours, minutes] = day[type].split(":").map(Number);
  let newHours = (hours + change + 24) % 24;
  day[type] = `${newHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// Apply current day schedule to all active days
const applyToAll = () => {
  const activeDay = days.value.find((day) => day.is_active);
  if (!activeDay) {
    alert(
      "Aucun jour actif trouvé. Veuillez activer au moins un jour avant de copier les horaires."
    );
    return;
  }

  if (
    confirm(
      `Voulez-vous appliquer les horaires de ${activeDay.name
      } (${formatTimeDisplay(activeDay.start_time)} - ${formatTimeDisplay(
        activeDay.end_time
      )}) à tous les jours actifs ?`
    )
  ) {
    days.value.forEach((day) => {
      if (day.is_active) {
        day.start_time = activeDay.start_time;
        day.end_time = activeDay.end_time;
      }
    });
  }
};

// Reset all schedules to default
const resetSchedule = () => {
  if (confirm("Voulez-vous vraiment réinitialiser tous les horaires ?")) {
    days.value.forEach((day) => {
      day.is_active = day.id <= 5; // Monday to Friday active by default
      day.start_time = day.id <= 5 ? "09:00" : day.id === 6 ? "10:00" : "00:00";
      day.end_time = day.id <= 5 ? "18:00" : day.id === 6 ? "16:00" : "00:00";
    });
  }
};

// Save schedule (would call API in real app)
const isSubmitting = ref(false);
const saveSchedule = async () => {
  isSubmitting.value = true;
  try {
    console.log("Saving token:", auth.token);
    // Transformer les données dans le format attendu par l'API
    const payload = {
      schedules: days.value.map((day) => ({
        day_id: day.id,
        start_time: day.start_time,
        end_time: day.end_time,
        is_active: day.is_active,
      })),
    };
    console.log("Payload:", payload);
    const { data, error } = await useFetch(
      "https://demo-allobeaute.tikaplace.com/api/user/enterprise/schedules/week",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    // Gérer la réponse
    if (error.value) {
      console.error("Erreur lors de l'enregistrement:", error.value);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } else {
      toast.success(data.value.message);
    }
  } catch (err) {
    console.error("Erreur inattendue:", err);
    toast.error("Une erreur inattendue est survenue");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="bg-gray-100 min-h-screen ml-64">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Header -->
      <header class="mb-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
          Gestion des horaires
        </h1>
        <p class="text-secondary-600">
          Définissez vos plages d'ouverture pour chaque jour
        </p>
      </header>

      <!-- Days Grid -->
      <div v-if="status === 'pending'" class="flex gap-4">
        <SkeletonCard v-for="n in 4" :key="n" />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div v-for="day in days" :key="day.id" class="day-card bg-white rounded-xl shadow-sm p-6"
          :class="{ 'opacity-70': !day.is_active }">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h3 class="text-lg font-semibold" :class="day.is_active ? 'text-secondary-800' : 'text-secondary-400'
                ">
                {{ day.name }}
              </h3>
              <p class="text-sm" :class="day.is_active ? 'text-secondary-500' : 'text-secondary-300'
                ">
                {{ day.short }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer toggle-checkbox" v-model="day.is_active" />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 toggle-label">
              </div>
            </label>
          </div>

          <div class="space-y-4" :class="{ hidden: !day.is_active }">
            <div>
              <label class="block text-sm font-medium text-secondary-600 mb-1">Heure d'ouverture</label>
              <div class="flex items-center gap-2">
                <input type="time" v-model="day.start_time"
                  class="border border-secondary-200 rounded-lg px-3 py-2 w-full" />
                <button class="time-decrement p-2 rounded-full hover:bg-secondary-100"
                  @click="adjustTime(day, 'start_time', -1)">
                  <i class="fas fa-minus text-secondary-500"></i>
                </button>
                <button class="time-increment p-2 rounded-full hover:bg-secondary-100"
                  @click="adjustTime(day, 'start_time', 1)">
                  <i class="fas fa-plus text-secondary-500"></i>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-600 mb-1">Heure de fermeture</label>
              <div class="flex items-center gap-2">
                <input type="time" v-model="day.end_time"
                  class="border border-secondary-200 rounded-lg px-3 py-2 w-full" />
                <button class="time-decrement p-2 rounded-full hover:bg-secondary-100"
                  @click="adjustTime(day, 'end_time', -1)">
                  <i class="fas fa-minus text-secondary-500"></i>
                </button>
                <button class="time-increment p-2 rounded-full hover:bg-secondary-100"
                  @click="adjustTime(day, 'end_time', 1)">
                  <i class="fas fa-plus text-secondary-500"></i>
                </button>
              </div>
            </div>

            <div class="pt-2">
              <div class="h-2 bg-gradient-to-r from-primary-100 to-secondary-200 rounded-full" :style="`background: linear-gradient(to right, #D4AF37 ${calculateGradient(
                day.start_time,
                day.end_time
              )}%, #FFFF00 ${calculateGradient(
                day.start_time,
                day.end_time
              )}%)`"></div>
              <div class="flex justify-between text-xs text-secondary-500 mt-1">
                <span>{{ formatTimeDisplay(day.start_time) }}</span>
                <span>{{ formatTimeDisplay(day.end_time) }}</span>
              </div>
            </div>
          </div>

          <div class="text-center py-4" :class="{ hidden: day.is_active }">
            <i class="fas fa-lock text-secondary-300 text-2xl mb-2"></i>
            <p class="text-secondary-400 text-sm">Fermé</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <button @click="resetSchedule"
          class="px-6 py-3 bg-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-300 transition flex items-center gap-2 tooltip">
          <i class="fas fa-undo"></i>
          <span>Réinitialiser</span>
          <span class="tooltip-text">Réinitialiser tous les horaires à leurs valeurs par défaut</span>
        </button>
        <button @click="saveSchedule" :disabled="isSubmitting"
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 tooltip">
          <Component :is="isSubmitting ? Loader : Save" class="mr-2 w-5 h-5"
            :class="{ 'animate-spin': isSubmitting }" />
          {{ isSubmitting ? "Envoi en cours..." : "Enregistré" }}
          <span class="tooltip-text">Sauvegarder les modifications apportées aux horaires</span>
        </button>
      </div>

      <!-- Current Schedule Preview -->
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h2 class="text-xl font-semibold text-secondary-800 mb-4 flex items-center gap-2">
          <i class="fas fa-calendar-alt text-secondary-500"></i>
          <span class="text-sm md:text-md lg:text-lg xl:text-lg">Aperçu de votre emploi du temps</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2" v-if="responses.length > 0">
          <div v-for="day in responses" :key="'preview-' + day.id" class="text-center p-2 rounded" :class="day.is_active
              ? 'bg-secondary-600 text-white'
              : 'bg-secondary-100 text-secondary-500'
            ">
            <div class="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">{{ day.day_name }}</div> 
            <div class="font-medium text-[10px] text-gold">{{ day.day_abbr}}</div> 
            <div class="text-xs">
              {{
                day.is_active
                  ? `${formatTimeDisplay(day.start_time)} - ${formatTimeDisplay(day.end_time)}`
              : "Fermé"
              }}
            </div>
          </div>
        </div>
        <div v-else class="text-center p-6 rounded bg-secondary-100 text-secondary-500">
          <i class="fas fa-calendar-alt text-secondary-500 text-2xl mb-2"></i>
          <p class="text-sm">Aucun emploi du temps actuellement</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.time-slider {
  -webkit-appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
}

.time-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0f172a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  background: #0f172a;
}

.day-card {
  transition: all 0.3s ease;
}

.day-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.toggle-checkbox:checked {
  right: 0;
  background-color: #0f172a;
}

.toggle-checkbox:checked+.toggle-label {
  background-color: #dec90a;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip {
  position: relative;
}

.tooltip .tooltip-text {
  visibility: hidden;
  width: 200px;
  background-color: #334155;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.875rem;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
