<script setup>
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-vue-next";
import { useToast } from "vue-toastification";
import 'intl-tel-input/build/css/intlTelInput.css';
import intlTelInput from 'intl-tel-input';
const phoneInput = ref(null)
let iti = null

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

const toast = useToast();
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from "@/components/ui/pin-input";

const phoneNumber = ref("");
const error = ref("");
const errorMesage = ref("");
const sending = ref(false);
const verifying = ref(false);

const showModal = ref(false);
const verificationCode = ref([""]);
const pinInputArray = ref(["", "", "", "", "", ""]);

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
  try {
    phoneNumber.value = '237' + phoneNumber.value;
    const {
      data: receiveOTPResponse,
      status,
      error,
    } = await useFetch(
      "https://demo-allobeaute.tikaplace.com/api/auth/send/otp",
      {
        method: "POST",
        body: {
          phone_number: phoneNumber.value.replace(/\s/g, ""), // Nettoyage des espaces
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", phoneNumber.value);
    if (error.value) {
      error.value = error.value.message || "Erreur lors de l'envoi du code";
      toast.error("Echec de connexion, Vérifier votre numéro de téléphone");
      sending.value = false;
      return;
    } else if (status.value === "success") {
      console.log("response", phoneNumber.value);
      showModal.value = true;
      sending.value = false;
    }
  } catch (e) {
    console.log("erreurs", e);
    error.value = "Erreur lors de l'envoi du code";
    sending.value = false;
    toast.error("Echec de connexion, Vérifier votre numéro de téléphone");
  }
};

const loginUserWithLaravel = async () => {
  verifying.value = true;
  errorMesage.value = "";
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
  phoneNumber.value = '237' + phoneNumber.value;
  try {
    console.log("phone envoyé", phoneNumber.value);
    const response = await $fetch(
      "https://demo-allobeaute.tikaplace.com/api/auth/login",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber.value.replace(/\s/g, ""),
          //code: verificationCode.value
        }),
      }
    );
    if (response?.status === "success") {
      const auth = useAuthStore();
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;

      if (!token) {
        throw new Error("Token non reçu dans la réponse");
      }

      // Mettre à jour le store Pinia
      auth.setAuthData({
        token: token,
        user: user || { phone: phoneNumber.value },
      });

      toast.success("Connexion réussie !");
      navigateTo("/");
    } else {
      // Gestion des erreurs de validation ou métier renvoyées par l'API
      const errorMessage = response.message || response.error || "Erreur inattendue";
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
    let errorMessage = "Erreur de connexion";

    if (error.response) {
      // Gestion des erreurs HTTP
      if (error.response.status === 422) {
        // Erreurs de validation
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          errorMessage = Object.values(validationErrors).flat().join('\n');
        } else {
          errorMessage = error.response.data?.message || "Erreur de validation de vos données";
        }
      } else if (error.response.status === 401) {
        // Erreurs d'authentification
        errorMessage = "Code de vérification incorrect";
      } else if (error.response.status === 429) {
        // Rate limiting
        errorMessage = "Trop de tentatives, veuillez réessayer plus tard";
      } else {
        // Autres erreurs HTTP
        errorMessage = error.response.data?.message || 
                      error.response.statusText || 
                      `Erreur serveur (${error.response.status})`;
      }
    } else if (error.message.includes("Token non reçu")) {
      errorMessage = "Erreur d'authentification: token manquant";
    } else if (error.message.includes("Cannot read properties")) {
      errorMessage = "Erreur de réponse du serveur";
    } else {
      // Erreurs réseau ou autres
      errorMessage = error.message || "Erreur de connexion au serveur";
    }

    errorMesage.value = errorMessage;
    toast.error(errorMessage);
    verifying.value = false;
  }
};

// Gestion de la saisie
const handleComplete = (value) => {
  verificationCode.value = value.join("");
};
</script>

<template>
  <main class="items-center justify-center p-8 rounded-xl shadow-2xl bg-white">
    <div class="flex justify-center mb-6">
      <img src="/img/logo.png" alt="Allô Beauté" class="h-20 object-contain" />
    </div>
    <div class="mb-8">
      <h1 class="text-center text-3xl font-bold bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent">Bienvenue !</h1>
      <p class="text-center mt-4 text-lg text-slate-700">Saisissez votre numéro de téléphone</p>
    </div>
    <form @submit.prevent="loginUserWithLaravel">
      <div class="flex items-center justify-center">

        <input 
          class="w-full py-4 px-24 rounded-lg text-gray-900 border-2 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300" 
          ref="phoneInput" 
          id="phone"
          v-model="phoneNumber"  
          name="phone" 
          type="tel" 
          placeholder="671657197" 
          required 
        />
      </div>
      <div class="mt-6">
        <button 
          class="w-full bg-gold text-white py-3 font-semibold rounded-lg hover:bg-yellow-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg" 
          :disabled="sending" 
          type="submit" 
          :class="{'opacity-50 cursor-not-allowed': sending}"
        >
          <span class="flex items-center justify-center" v-if="sending">
            <div
              class="animate-spin ease-linear rounded-full w-6 h-6 border-3 border-white border-t-transparent mr-3">
            </div>
            <span class="text-lg">Patienter svp...</span>
          </span>
          <span class="cursor-pointer text-lg" v-else>Connexion</span>
        </button>
      </div>
    </form>
    <div class="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
      <span class="flex items-center text-blue-600 font-semibold text-sm">
        <ArrowLeft class="mr-1" />
        <NuxtLink to="/" class="text-sm text-gold">Accueil</NuxtLink>
      </span>
      <p class="text-sm text-gray-600">
        Vous n'avez pas de compte ?
        <NuxtLink href="/auth/register" class="underline text-gold font-semibold">
          Créer un compte
        </NuxtLink>
      </p>
    </div>
    <!-- Modal animé -->
    <Transition name="slide-down">
      <form action="" @submit.prevent="loginUserWithLaravel">
        <div v-if="showModal"
          class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-md modal-content">
            <div class="p-8">
              <div class="flex justify-center mb-6">
                <img src="/img/logo.png" alt="Allô Beauté" class="h-16 object-contain" />
              </div>
              <h3 class="text-2xl font-bold text-center bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent mb-4">
                Vérification
              </h3>
              <p class="text-gray-600 mb-8 text-center">
                Un code de vérification a été envoyé au:<br>
                <span class="font-bold text-lg text-gold">{{ phoneNumber }}</span><br>
                Veuillez entrer ce code pour vous connecter.
              </p>

              <div class="flex justify-center mb-8">
                <PinInput required id="pin-input" v-model="pinInputArray" placeholder="○" @complete="handleComplete">
                  <PinInputGroup class="gap-2">
                    <template v-for="(id, index) in 6" :key="id">
                      <PinInputInput 
                        class="w-12 h-12 text-xl font-bold rounded-lg border-2 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300" 
                        :index="index" 
                      />
                    </template>
                  </PinInputGroup>
                </PinInput>
              </div>

              <div class="space-y-4">
                <div class="text-center">
                  <span class="text-gray-600">Vous n'avez rien reçu ? </span>
                  <span @click="verify" class="text-gold font-semibold cursor-pointer hover:text-yellow-600 transition-colors">
                    Renvoyer le code
                  </span>
                </div>

                <div class="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    @click="showModal = false" 
                    class="px-6 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Fermer
                  </Button>
                  <Button 
                    type="submit" 
                    :disabled="verifying"
                    class="px-6 py-2 bg-gold text-white hover:bg-yellow-600 transition-colors"
                  >
                    <span class="flex items-center justify-center" v-if="verifying">
                      <div class="animate-spin ease-linear rounded-full w-5 h-5 border-3 border-white border-t-transparent mr-3">
                      </div>
                      <span>Vérification...</span>
                    </span>
                    <span v-else>Vérifier</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Transition>
  </main>

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
</style>
