<script setup>
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-vue-next";
import { useToast } from "vue-toastification";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from "@/components/ui/pin-input";
import { Input } from "@/components/ui/input";
import 'intl-tel-input/build/css/intlTelInput.css';
import intlTelInput from 'intl-tel-input';
const phoneInput = ref(null)
let iti = null
const loadingSpecialitySelection = ref(false);
const phoneNumber = ref("");
const errorMesage = ref("");
const sending = ref(false);
const isSubmitting = ref(false);
const verifying = ref(false);
const showStepper = ref(false);
const showSpecialitySelection = ref(false);
const specialisationData = ref({
  specialization: null,
  categories: [],
});
const userType = ref("client");
const prenom = ref("");
const nom = ref("");
const adresse = ref("");
const showModal = ref(false);
const verificationCode = ref([""]);
const pinInputArray = ref(["", "", "", "", "", ""]);
const toast = useToast();
// Données du prestataire
const prestataireData = ref(null);

onMounted(() => {
  if (!phoneInput.value) {
    console.error('phoneInput is not defined or not found');
    return;
  }
  if (phoneInput.value) {
    iti = intlTelInput(phoneInput.value, {
      utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/utils.js', 
      initialCountry: 'cm',
      separateDialCode: true,
    })
  }
})

/*const sendCode = async () => {
  sending.value = true;
  sentSuccess.value = false;

  const { success, error: authError } = await phoneSendAuth(phoneNumber.value);
  if (success) {
    sending.value = true;
    showModal.value = true;
    sentSuccess.value = true;
    showVerification.value = true;
  } else {
    error.value = authError;
  }
  sending.value = false;
};*/

const verify = async () => {
  sending.value = true;
  if (
    !phoneNumber.value ||
    phoneNumber.value.length < 9 ||
    phoneNumber.value.length > 9
  ) {
    toast.error("Veuillez entrer un numéro de téléphone valide.");
    setTimeout(() => {
      sending.value = false;
    }, 5000);
    return;
  }
if (userType.value === "prestataire") {
   setTimeout(() => {
      sending.value = false;
    }, 500);
      showSpecialitySelection.value = true;
      //showModal.value = false;
    } else {
      // Client : inscription directe
      await registerUserWithLaravel();
      sending.value = false;
    }
  /*error.value = "";
  verifying.value = true;
  loadingSpecialitySelection.value = true;
  const {
    success,
    error: authError,
    user,
  } = await verifyCode(verificationCode.value);

  if (success) {
    if (userType.value === "prestataire") {
      showSpecialitySelection.value = true;
      showModal.value = false;
    } else {
      // Client : inscription directe
      await registerUserWithLaravel(user);
    }
  } else {
    error.value = authError;
  }*/
  //verifying.value = false;
  loadingSpecialitySelection.value = false;
};
const registerUserWithLaravel = async () => {
  phoneNumber.value = "237" + phoneNumber.value;
  try {
    // Structure de base commune
    let payload = {
      phone_number: phoneNumber.value,
    };

    if (userType.value === "client") {
      // Structure pour les clients
      payload = {
        ...payload,
        role: userType.value,
        nom: nom.value,
        prenom: prenom.value,
        address: adresse.value,
      };
    } else if (userType.value === "prestataire" && prestataireData.value) {
      // Structure complète pour les prestataires selon la doc Swagger
      console.log("Prestataire Data:", prestataireData.value.phone);
      payload = {
        ...payload,
        role: "provider",
        nom: prestataireData.value.fullName,
        prenom: prestataireData.value.firstName,
        institute_info: {
          name: prestataireData.value.establishment,
          type: specialisationData.value.specialization.id,
          address: `${prestataireData.value.street}, ${prestataireData.value.neighborhood}`,
          city: prestataireData.value.city,
          phone: "237" + prestataireData.value.phone,
          email: prestataireData.value.email,
          description: prestataireData.value.description,
          repere: prestataireData.value.landmark,
          experience_years: prestataireData.value.experience,
          is_independent: prestataireData.value.is_independent,
        },
        service_category:
          specialisationData.value.specialization.service_categories.map(
            (cat) => cat.id
          ),

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
    }
    console.log("Données envoyées à Laravel:", payload);
    //return;
    const response = await $fetch(
      "https://demo-allobeaute.tikaplace.com/api/auth/register",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (response?.status === "error") {
      throw new Error(response.message);
    }
    toast.success("Inscription réussie ! redirection...");
    setTimeout(() => {
      navigateTo("/");
    }, 1000);
  } catch (error) {
    console.error("Erreur API:", error);

    let userMessage = "Une erreur est survenue lors de l'inscription";

    // 1. Erreurs de validation Laravel (422)
    if (error?.response?.status === 422 && error.response._data?.errors) {
      const errors = error.response._data.errors;

      // Récupération du premier message d'erreur
      const firstError = Object.values(errors)[0][0];

      // Messages plus user-friendly pour les champs courants
      userMessage = firstError
        .replace(/phone number/i, "numéro de téléphone")
        .replace(/email/i, "adresse email")
        .replace(/required/i, "est requis")
        .replace(/invalid/i, "n'est pas valide");
    }
    // 2. Erreurs métier personnalisées (400, 409, etc.)
    else if (error?.response?._data?.message) {
      userMessage = error.response._data.message;

      // Traduction des messages courants
      userMessage = userMessage
        .replace(/Phone number already exists/i, "Ce numéro de téléphone est déjà utilisé")
        .replace(/Email already exists/i, "Cette adresse email est déjà utilisée");
    }
    // 3. Erreurs réseau/timeout
    else if (error.name === 'FetchError') {
      userMessage = "Problème de connexion au serveur. Veuillez réessayer.";
    }
    // 4. Autres erreurs inattendues
    else {
      userMessage = "Une erreur inattendue est survenue. Contactez le support si le problème persiste.";
    }

    // Affichage à l'utilisateur
    toast.error(userMessage);
    errorMesage.value = userMessage;
  }
};

// Gestion de la saisie
const handleComplete = (value) => {
  verificationCode.value = value.join("");
};

const validerSelection = ({ specialization, categories }) => {
  specialisationData.value = {
    specialization,
    categories,
  };
  showSpecialitySelection.value = false;
  showStepper.value = true;
};

const handleFormSubmission = async (formData) => {
  isSubmitting.value = true;
  try {
    // Stocker les données du prestataire
    prestataireData.value = { ...formData };
    console.log("Données du prestataire :", prestataireData.value);
    await registerUserWithLaravel();
  
  } catch (error) {
    console.error("", error);
    toast.error("Une erreur s'est produite, veuillez réessayer!");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Card v-if="!showSpecialitySelection && !showStepper" class="mx-auto max-w-8xl md:w-2/3 lg:w-1/2 bg-white shadow-xl">
    <CardHeader>
      <div class="flex justify-center mb-6">
        <img src="/img/logo.png" alt="Allô Beauté" class="h-20 object-contain" />
      </div>
      <CardTitle class="text-3xl text-center font-bold bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent">
        Saisir votre numéro de téléphone
      </CardTitle>
      <CardDescription class="text-center mt-4">
        <span class="text-lg text-slate-700 font-medium">{{
          userType === "client"
            ? "Créer un compte et réserver un service"
            : "Créer un compte et vendez vos services"
        }}</span>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Tabs pour choisir le type d'utilisateur -->
      <div class="flex mb-8 justify-center gap-4">
        <button @click="userType = 'client'" :class="{
          'bg-gold text-white shadow-lg transform scale-105': userType === 'client',
          'bg-gray-100 text-gray-600 hover:bg-gray-200': userType !== 'client',
        }" class="py-3 px-6 rounded-full font-semibold text-sm transition-all duration-300 focus:outline-none">
          Client
        </button>
        <button @click="userType = 'prestataire'" :class="{
          'bg-gold text-white shadow-lg transform scale-105': userType === 'prestataire',
          'bg-gray-100 text-gray-600 hover:bg-gray-200': userType !== 'prestataire',
        }" class="py-3 px-6 rounded-full font-semibold text-sm transition-all duration-300 focus:outline-none">
          Prestataire
        </button>
      </div>

      <form @submit.prevent="verify">
        <div class="grid gap-4">
          <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2" name="tab-transition"
            mode="out-in">
            <div v-if="userType === 'client'" class="grid gap-4">
              <!-- Première ligne : Prénom et Nom -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label class="text-slate-900" for="prenom">Prénom <span class="text-red-500">*</span></Label>
                  <Input class="text-gray-900 py-6 rounded-lg border-2 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300" id="prenom"
                    v-model="prenom" type="text" placeholder="Votre prénom" required />
                </div>
                <div class="grid gap-2">
                  <Label class="text-slate-900" for="nom">Nom <span class="text-red-500">*</span></Label>
                  <Input class="text-gray-900 py-6 rounded-lg border-2 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300" id="nom" 
                    v-model="nom" type="text" placeholder="Votre nom" required />
                </div>
              </div>
              <!-- Deuxième ligne : Adresse -->
              <div class="grid gap-2">
                <Label class="text-slate-900" for="adresse">Adresse <span class="text-red-500">*</span></Label>
                <Input class="text-gray-900 py-6 rounded-md focus:outline-none focus:border-gray-800" id="adresse"
                  v-model="adresse" type="text" placeholder="Votre adresse" required />
              </div>
            </div>
          </Transition>
          <div class="grid gap-4">
            <Label class="text-slate-900" for="tel">Téléphone <span class="text-red-500">*</span></Label>
            <input class="text-slate-900 py-3 border-gray-300 rounded-md focus:outline-none focus:border-slate-900" ref="phoneInput" id="phone"
              v-model="phoneNumber" type="tel" placeholder="674859874" required name="phone" />
          </div>
          <Button class="w-full bg-gold text-white font-semibold py-6 rounded-lg hover:bg-yellow-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg" :disabled="sending">
            <span class="flex items-center justify-center" v-if="sending">
              <div class="animate-spin ease-linear rounded-full w-6 h-6 border-3 border-white border-t-transparent mr-3"></div>
              Envoi en cours...
            </span>
            <span v-else class="text-lg">Créer un compte
              {{ userType === "client" ? "client" : "prestataire" }}</span>
          </Button>
        </div>
      </form>

      <div class="mt-6 text-sm flex flex-col gap-y-4 sm:flex-row sm:justify-between items-center">
        <span class="flex items-center text-gold font-semibold hover:text-yellow-600 transition-colors duration-300">
          <ArrowLeft class="mr-2 h-5 w-5" />
          <NuxtLink to="/" class="text-base">Accueil</NuxtLink>
        </span>

        <p class="text-sm text-gray-600 text-center sm:text-right">
          Vous avez déjà un compte ?
          <NuxtLink href="/auth/login" class="underline text-gold font-semibold">
            Connectez-vous
          </NuxtLink>
        </p>
      </div>
    </CardContent>
  </Card>
  <!-- Modal animé -->
  <Transition name="slide-down">
    <form @submit.prevent="verify">
      <div v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 modal-content">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Confirmation d'inscription
            </h3>
            <p class="text-gray-600 mb-6 text-sm">
              Un code de vérification a été envoyé au:
              <span class="font-bold">{{ phoneNumber }}. </span>Veuillez entrer
              ce code pour compléter votre inscription.
            </p>

            <div>
              <PinInput required id="pin-input" v-model="pinInputArray" placeholder="○" @complete="handleComplete">
                <PinInputGroup class="gap-1">
                  <template v-for="(id, index) in 6" :key="id">
                    <PinInputInput class="rounded-md border" :index="index" />
                    <template v-if="index !== 5">
                      <PinInputSeparator />
                    </template>
                  </template>
                </PinInputGroup>
              </PinInput>
            </div>
            <div class="flex justify-end space-x-3 mt-4">
              <div>
                Vous n'avez rien reçu?
                <span @click="sendCode" class="text-blue-600 cursor-pointer">Renvoyer le code</span>
              </div>
              <Button variant="outline" @click="showModal = false">
                Fermer
              </Button>
              <Button type="submit" :disabled="verifying">
                <span class="flex items-center" v-if="sending">
                  <div class="animate-spin ease-linear rounded-full w-5 h-5 border-t-2 border-b-2 border-white mr-3">
                  </div>
                  Verification en cours...
                </span>
                <span v-else>Verifier</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </Transition>
  <!-- Loader pendant le chargement -->
  <div v-if="loadingSpecialitySelection"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
  </div>
  <SpecialitySelection v-if="showSpecialitySelection" @validated="validerSelection" />
  <StepperContainer v-if="showStepper" @submit="handleFormSubmission" v-show="!loadingSpecialitySelection"
    :is-submitting="isSubmitting" />
</template>

<style scoped>
.iti {
  width: 100%;
  --iti-path-flags-1x: url('../../node_modules/intl-tel-input/build/img/flags.webp');
  --iti-path-flags-2x: url('../../node_modules/intl-tel-input/build/img/flags@2x.webp');
  --iti-path-globe-1x: url('../../node_modules/intl-tel-input/build/img/globe.webp');
  --iti-path-globe-2x: url('../../node_modules/intl-tel-input/build/img/globe@2x.webp');
}

.iti__tel-input {
  width: 100%;
  box-sizing: border-box;
  padding-left: 50px;
}

.iti__flag-container {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}

.iti__selected-dial-code {
  color: white !important;
  /* Force la couleur blanche pour l'indicatif */
}
/* Animation douce pour le switch */
.switch-transition {
  transition: all 0.4s ease-out;
}

/* Animation d'entrée améliorée avec effet de ralentissement */
.slide-down-enter-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Animation de sortie */
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

/* Animation spécifique pour le contenu du modal */
.slide-down-enter-active .modal-content,
.slide-down-leave-active .modal-content {
  transition: all 0.4s ease-out;
}

.slide-down-enter-from .modal-content,
.slide-down-leave-to .modal-content {
  transform: translateY(-20px);
  opacity: 0;
}

/* Style pour les inputs de code */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Dans votre CSS */
.tab-transition-enter-active,
.tab-transition-leave-active {
  transition: opacity 0.15s ease;
}

.tab-transition-enter-from,
.tab-transition-leave-to {
  opacity: 0;
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #ffd700;
  /* Couleur or */
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
