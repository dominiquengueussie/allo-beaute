<script setup>
import {
  ChevronRight,
  HandHeart,
  Star,
  Check,
  Tags,
  ChevronsRight,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";
const toast = useToast();
// État
const isSubmitting = ref(false);
const specializations = ref([]);
const selectedSpecialization = ref(null);
const selectedCategories = ref([]);
const showStepper = ref(false);
const showspecilalitySelection = ref(true);
const prestataireData = ref(null);
const apiEndpoint =
  "https://demo-allobeaute.tikaplace.com/api/user/become-provider";
const auth = useAuthStore();
//console.log("Token:", auth.token);
//console.log("Auth:", auth);
// Récupération des données depuis l'API
const { data, status, error } = await useFetch(
  "https://demo-allobeaute.tikaplace.com/api/enterprises/types"
);

if (data.value?.status === "success") {
  specializations.value = data.value.data;
  //console.log("spécialisations:", specializations.value);
}

// Réinitialiser les catégories quand on change de spécialisation
watch(selectedSpecialization, () => {
  selectedCategories.value = [];
});
const emit = defineEmits(["validated"]);

const becomeProvider = (formDataProvider) => {
 isSubmitting.value = true;
 prestataireData.value = { ...formDataProvider };
  try {
    const selected = specializations.value.find(
      (s) => s.id === selectedSpecialization.value
    );
    let categoryIds = [];
    if (selectedCategories.value.length > 0) {
      categoryIds =
        selected?.service_categories
          ?.filter((cat) => selectedCategories.value.includes(cat.name))
          ?.map((cat) => cat.id) || [];
    } else {
      categoryIds = selected?.service_categories?.map((cat) => cat.id) || [];
    }
    const payload = {
      //role: "provider",
      //nom: prestataireData.value.fullName,
      //prenom: prestataireData.value.firstName,
      name: prestataireData.value.establishment,
      type: selected?.id,
      address: `${prestataireData.value.street}, ${prestataireData.value.neighborhood}`,
      city: prestataireData.value.city,
      email: prestataireData.value.email,
      phone: "237" + prestataireData.value.phone,
      description: prestataireData.value.description,
      repere: prestataireData.value.landmark,
      experience_years: String(prestataireData.value.experience),
      is_independent: prestataireData.value.is_independent,
      service_category: categoryIds,
      media: {
        diploma: prestataireData.value.diploma
          ? {
            base64: prestataireData.value.diploma.base64,
            mime_type: prestataireData.value.diploma.mime_type,
            file_name: prestataireData.value.diploma.file_name,
            size: String(prestataireData.value.diploma.size),
          }
          : null,
        portfolio: prestataireData.value.portfolio
          ? {
            base64: prestataireData.value.portfolio.base64,
            mime_type: prestataireData.value.portfolio.mime_type,
            file_name: prestataireData.value.portfolio.file_name,
            size: String(prestataireData.value.portfolio.size),
          }
          : null,
      },
    };
    //console.log("Payload final:", payload);
    //console.log("Token:", auth.token);
    const { data: apiResponse, error } = useFetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    });

    if (error.value) {
      console.error("API Error:", error.value);
      toast.error("Une erreur s'est produite lors de la soumission du formulaire.");
    }
    if (apiResponse.value?.status === "success") {
      toast.success("Votre demande a été soumise pour approbation.");
      navigateTo("/dashboard");
    } else {
      toast.error("Une erreur s'est produite lors de la soumission du formulaire.");
    }
  } catch (error) {
    console.error("Erreur lors de la conversion des fichiers :", error);
  } finally {
    isSubmitting.value = false;
  }
};

function validerSelection() {
  const selected = specializations.value.find(
    (s) => s.id === selectedSpecialization.value
  );
  showStepper.value = true;
  showspecilalitySelection.value = false;
  emit("validated", {
    specialization: selected,
    categories: selectedCategories.value,
  });
}

// Vérifier si le bouton doit être désactivé
const shouldDisableButton = computed(() => {
  if (!selectedSpecialization.value) return true;

  const spec = specializations.value.find(
    (s) => s.id === selectedSpecialization.value
  );
  // Si la spécialisation a des catégories mais aucune n'est sélectionnée
  if (
    spec?.service_categories?.length > 0 &&
    selectedCategories.value.length === 0
  ) {
    return true;
  }

  return false;
});
// Catégories de la spécialisation sélectionnée
const currentCategories = computed(() => {
  const spec = specializations.value.find(
    (s) => s.id === selectedSpecialization.value
  );
  return spec?.service_categories || [];
});
</script>

<template>
  <div class="flex items-center justify-center mx-auto" v-if="showspecilalitySelection">
    <div class="w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-slate-600 to-slate-800 p-6 text-white">
        <div class="flex items-center space-x-3">
          <HandHeart class="h-10 w-10" />
          <div>
            <h1 class="text-2xl font-bold">Sélectionnez votre domaine</h1>
            <p class="text-indigo-100 text-sm mt-1">
              Choisissez votre spécialisation pour personnaliser votre
              expérience
            </p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 mx-auto max-w-2xl max-h-[calc(100vh-150px)] overflow-y-auto">
        <!-- Chargement / Erreur -->
        <div v-if="pending" class="text-center text-gray-500">
          Chargement...
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          Erreur de chargement
        </div>

        <!-- Liste des spécialisations -->
        <div v-else>
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Star class="mr-2 text-yellow-500" /> Spécialisations disponibles
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="spec in specializations" :key="spec.id"
                class="card-hover border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200"
                :class="{
                  'bg-indigo-50 border-indigo-300':
                    selectedSpecialization === spec.id,
                }" @click="selectedSpecialization = spec.id">
                <label class="flex items-center space-x-4 cursor-pointer">
                  <div class="relative">
                    <input type="radio" :value="spec.id" v-model="selectedSpecialization" class="sr-only" />
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="{
                      'border-indigo-500': selectedSpecialization === spec.id,
                      'border-gray-300': selectedSpecialization !== spec.id,
                    }">
                      <div v-if="selectedSpecialization === spec.id" class="w-3 h-3 rounded-full bg-indigo-500"></div>
                    </div>
                  </div>
                  <div>
                    <span class="text-gray-800 font-medium">{{
                      spec.name
                    }}</span>
                    <p class="text-xs text-gray-500 mt-1">
                      <span v-if="spec.service_categories.length > 0">
                        {{ spec.service_categories.length }} catégorie(s)
                        disponible(s)
                      </span>
                      <span v-else> Aucune sous-catégorie </span>
                    </p>
                  </div>
                  <div class="ml-auto text-gray-400">
                    <ChevronRight />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Catégories -->
          <transition name="fade">
            <div v-if="selectedSpecialization && currentCategories.length"
              class="mb-8 bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h4 class="text-md font-medium text-gray-700 mb-3 flex items-center">
                <Tags class="mr-2 text-purple-500" />
                Catégories pour
                <span class="font-semibold ml-1">
                  {{
                    specializations.find((s) => s.id === selectedSpecialization)
                      ?.name
                  }}
                </span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="cat in currentCategories" :key="cat.id"
                  class="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors">
                  <label class="flex items-center space-x-3 cursor-pointer w-full">
                    <div class="relative">
                      <input type="checkbox" :value="cat.name" v-model="selectedCategories" class="sr-only" />
                      <div class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors" :class="{
                        'bg-indigo-500 border-indigo-500':
                          selectedCategories.includes(cat.name),
                        'border-gray-300': !selectedCategories.includes(
                          cat.name
                        ),
                      }">
                        <Check v-if="selectedCategories.includes(cat.name)" class="text-white text-xs" />
                      </div>
                    </div>
                    <span class="text-gray-700">{{ cat.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </transition>

          <!-- Bouton -->
          <div class="pt-4 border-t border-gray-200">
            <button @click="validerSelection"
              class="w-full bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-900 hover:to-slate-700 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              :disabled="shouldDisableButton" :class="{ 'opacity-50 cursor-not-allowed': shouldDisableButton }">
              <span>Continuer</span>
              <ChevronsRight class="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <StepperContainer v-if="showStepper" @becomeProvider="becomeProvider" :is-submitting="isSubmitting" />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.checkbox-custom:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>
