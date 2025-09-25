<script setup>
import { Banknote, Info } from "lucide-vue-next";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "vue-toastification";

const route = useRoute();
const serviceId = route.params.edit;

const formData = ref({
  price: "",
  durationInput: 0,
  durationUnit: "hours",
  description: "",
  availableAtHome: false,
  travelFees: "",
  images: [],
});

const isLoading = ref(true);
const errors = ref({});
const error = ref({});
const isSubmitting = ref(false);
const auth = useAuthStore();

const validationRules = {
  serviceId: [{ required: true, message: "Veuillez sélectionner un service" }],
  price: [
    { required: true, message: "Le prix est requis" },
    { min: 0.01, message: "Le prix doit être supérieur à 0" },
  ],
  durationInput: [
    { required: true, message: "La durée est requise" },
    { min: 0.1, message: "La durée doit être supérieure à 0" },
  ],
  description: [
    { required: true, message: "La description est requise" },
    {
      minLength: 20,
      message: "La description doit faire au moins 20 caractères",
    },
  ],
  images: [
    {
      required: true,
      message: "Au moins une image est requise",
      condition: () => true, // Toujours valider
    },
    {
      maxCount: 5,
      message: "Maximum 5 images autorisées",
      condition: () => true,
    },
  ],
};

// Fonction de validation
function validateField(field, value) {
  // Initialise errors.value[field] si nécessaire
  if (!errors.value[field]) {
    errors.value[field] = [];
  }
  // Vérifiez que la règle existe
  if (!validationRules[field]) return;

  validationRules[field].forEach((rule) => {
    const shouldValidate = !rule.condition || rule.condition();
    if (!shouldValidate) return;

    // Gestion spéciale pour les images
    if (field === "images") {
      const imagesArray = value || [];

      if (rule.required && imagesArray.length === 0) {
        errors.value[field].push(rule.message);
      }
      if (rule.maxCount && imagesArray.length > rule.maxCount) {
        errors.value[field].push(rule.message);
      }
    }
    // Validation standard pour les autres champs
    else {
      if (rule.required && !value) {
        errors.value[field].push(rule.message);
      }
      if (rule.min && value < rule.min) {
        errors.value[field].push(rule.message);
      }
      if (rule.minLength && value?.length < rule.minLength) {
        errors.value[field].push(rule.message);
      }
    }
  });
}

// Validation globale
function validateForm() {
  // Réinitialise les erreurs
  errors.value = {};
  validateField("price", formData.value.price);
  validateField("durationInput", formData.value.durationInput);
  validateField("description", formData.value.description);
  validateField("images", formData.value.images || []);

  return Object.keys(errors.value).every(
    (key) => errors.value[key].length === 0
  );
}

const handleImagesUpdate = (files) => {
  formData.value.images = files;
  validateField("images", files);
};

async function handleSubmit() {
  isSubmitting.value = true;
  if (!validateForm()) {
    isSubmitting.value = false;
    return;
  }

  // Conversion de la durée en minutes si nécessaire
  const durationInMinutes =
    formData.value.durationUnit === "hours"
      ? Math.round(formData.value.durationInput * 60)
      : Math.round(formData.value.durationInput);
  const formDataSend = {
    price: parseFloat(formData.value.price),
    duration: durationInMinutes, // Utilisez la valeur convertie
    description: formData.value.description,
    is_active: true,
    is_home_service: formData.value.availableAtHome,
    transport_fees: formData.value.availableAtHome
      ? parseFloat(formData.value.travelFees)
      : 0,
    medias: formData.value.images.map((image) => ({
      base64: image.base64,
      mime_type: image.mime_type,
      file_name: image.file_name,
      size: image.size,
      isNew: true,
    })),
  };

  try {
    const response = await fetch(
      `https://demo-allobeaute.tikaplace.com/api/services/${serviceId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataSend),
      }
    );

    /*   console.log("Données envoyées:", formDataSend);
    console.log("Résponse de l'API:", response); */
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const toast = useToast();
      const errorMessage =
        errorData.message ||
        `Erreur ${response.status}: ${response.statusText}` ||
        "Erreur lors de la soumission";

      toast.error(errorMessage);
      console.error("Erreur API:", { status: response.status, errorData });
      throw new Error(errorMessage);
    }

    const successData = await response.json();
    const toast = useToast();
    toast.success(
      successData.message || "Modifications enregistrées avec succès !"
    );
    navigateTo("/dashboard/services");
    // Réinitialisation si nécessaire
    resetForm();
    return successData;
  } catch (error) {
    console.error("Erreur:", error);
    errors.value.submission = [error.message];
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  //serviceId.value = "";
  price.value = 0;
  durationInput.value = 0;
  description.value = "";
  images.value = [];
  errors.value = {};
  travelFees.value = "";
}

async function fetchDetailServices() {
  try {
    isLoading.value = true;
    const { data } = await useFetch(
      `https://demo-allobeaute.tikaplace.com/api/services/${serviceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (data.value?.data) {
      const service = data.value.data;
      formData.value = {
        price: service.price || "",
        durationInput: service.duration, // Convertit en heures/minutes
        durationUnit: "minutes", // Par défaut
        description: service.description || "",
        availableAtHome: service.served_at_home || false,
        travelFees: service.transportation_fees || "",
        images: [],
      };
      // Conversion spéciale pour la durée
      if (service.duration >= 60) {
        formData.value.durationInput = (service.duration / 60).toFixed(1);
        formData.value.durationUnit = "hours";
      }
    }
  } catch (err) {
    error.value = err;
    console.error("Erreur:", err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchDetailServices();
});

// Calcul de la durée en minutes
const durationInMinutes = computed(() => {
  return durationUnit.value === "hours"
    ? durationInput.value * 60
    : durationInput.value;
});

// Transitions
const beforeEnter = (el) => {
  el.style.height = "0";
  el.style.opacity = "0";
};

const enter = (el, done) => {
  const height = el.scrollHeight;
  el.style.transition = "all 0.3s ease";
  el.style.height = `${height}px`;
  el.style.opacity = "1";
  setTimeout(done, 300);
};

const leave = (el, done) => {
  el.style.transition = "all 0.3s ease";
  el.style.height = "0";
  el.style.opacity = "0";
  setTimeout(done, 300);
};
</script>

<template>
  <div
    class="relative bg-gradient-to-r from-slate-700 to-slate-900 h-64 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black opacity-40"></div>
    <div class="relative z-10 text-center px-4">
      <h1 class="text-4xl font-bold text-white mb-2 animate-on-scroll">
        Détente & Bien-être
      </h1>
      <p class="text-xl text-gray-200 animate-on-scroll">
        Modifiez votre service en toute sécurité
      </p>
    </div>
  </div>
  <div class="mt-5">
    <div class="container max-w-screen-lg mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Informations Générales -->
        <div class="bg-white p-6 rounded-xl shadow space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-2 font-medium">Prix <span>*</span></label>
              <div class="relative">
                <input
                  type="number"
                  v-model.number="formData.price"
                  @blur="validateField('price', price)"
                  class="w-full border border-gray-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-colors rounded p-2 pl-8"
                  :class="{ 'border-red-500': errors.price?.length }"
                  placeholder="ex: 50"
                  min="0"
                  step="0.01"
                />
                <Banknote
                  class="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                />
                <div
                  v-if="errors.price?.length"
                  class="text-red-500 text-sm mt-1"
                >
                  {{ errors.price[0] }}
                </div>
              </div>
            </div>

            <div>
              <label class="block mb-2 font-medium"
                >Durée du Service<span>*</span></label
              >
              <div class="flex gap-2">
                <input
                  type="number"
                  v-model.number="formData.durationInput"
                  @blur="validateField('durationInput', durationInput)"
                  class="flex-1 border border-gray-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-colors rounded p-2"
                  :class="{ 'border-red-500': errors.durationInput?.length }"
                  placeholder="Durée"
                  min="0"
                  step="0.1"
                />
                <select
                  v-model="formData.durationUnit"
                  class="border border-gray-300 rounded p-2 focus:border-slate-900 focus:outline-none"
                >
                  <option value="hours" selected>Heures</option>
                  <option value="minutes">Minutes</option>
                </select>
                <div
                  v-if="errors.durationInput?.length"
                  class="text-red-500 text-xs mt-1"
                >
                  {{ errors.durationInput[0] }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block mb-2 font-medium"
              >Description Détaillée <span>*</span></label
            >
            <textarea
              v-model="formData.description"
              @blur="validateField('description', description)"
              class="w-full border border-gray-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-colors rounded p-2 resize-y"
              :class="{ 'border-red-500': errors.description?.length }"
              rows="5"
              placeholder="Décrivez votre service en détail..."
            ></textarea>
            <div
              v-if="errors.description?.length"
              class="text-red-500 text-sm mt-1"
            >
              {{ errors.description[0] }}
            </div>
          </div>
          <div>
            <label class="block mb-2 font-medium"
              >Définir les images du Service <span>*</span></label
            >
            <ImageUploader
              @update:files="handleImagesUpdate"
              :error="!!errors.images?.length"
            />
          </div>
          <div v-if="errors?.images?.length" class="text-red-500 text-sm mt-1">
            {{ errors.images[0] }}
          </div>
        </div>

        <!-- Service à Domicile -->
        <Card>
          <CardHeader>
            <CardTitle>Service à Domicile</CardTitle>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="flex items-center justify-between">
              <Label for="available-at-home" class="cursor-pointer">
                Proposer ce service à domicile
              </Label>
              <Switch
                id="available-at-home"
                v-model="formData.availableAtHome"
                :class="[
                  'data-[state=checked]:bg-slate-900',
                  'bg-gray-500',
                  'transition-colors',
                  'w-[42px] h-[24px] rounded-full',
                  'relative',
                ]"
              />
            </div>

            <Transition
              name="fade-height"
              @before-enter="beforeEnter"
              @enter="enter"
              @leave="leave"
            >
              <div
                v-if="formData.availableAtHome"
                class="space-y-6 overflow-hidden"
              >
                <div>
                  <Label for="travel-fees" class="mb-2 block"
                    >Frais de Déplacement</Label
                  >
                  <div class="relative">
                    <Input
                      id="travel-fees"
                      type="number"
                      placeholder="ex: 10"
                      v-model="formData.travelFees"
                      class="pl-8"
                      min="0"
                      step="0.01"
                    />
                    <Banknote
                      class="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    Ces frais s'appliquent par déplacement.
                  </p>
                </div>
              </div>
            </Transition>
          </CardContent>
        </Card>

        <div class="text-right mb-5 flex justify-end">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="bg-slate-800 hover:bg-gold text-white font-semibold px-6 py-2 rounded mb-5 transition-colors duration-300 flex items-center justify-center gap-2 min-w-[180px]"
            :class="{
              'hover:bg-slate-800': isSubmitting,
              'opacity-75': isSubmitting,
            }"
          >
            <div
              v-if="isSubmitting"
              class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"
            ></div>
            {{
              isSubmitting
                ? "Modification en cours... "
                : "Enregistrer la modification"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Playfair Display", "serif";
}

body {
  font-family: "Montserrat", "sans-serif";
}
</style>
