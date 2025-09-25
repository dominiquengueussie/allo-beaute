<script setup>
import { Clock, CalendarCheck, Phone, Mail, MapPin } from "lucide-vue-next";

const selectedTime = ref(null);
const isDomicile = ref(false);
const adresse = ref('')
const showError = ref(false)

const validerFormulaire = () => {
    if (isDomicile.value && !adresse.value.trim()) {
        showError.value = true
    } else {
        showError.value = false
        // Envoie ou traitement du formulaire
        alert('Formulaire soumis avec succès !')
    }
    bookAppointment()
}
const handleTimeSelection = (time) => {
    selectedTime.value = time;
};

const bookAppointment = () => {
    if (!selectedTime.value) {
        alert("Veuillez sélectionner un créneau horaire");
        return;
    }
    // Implement booking logic
    console.log("Booking appointment at", selectedTime.value);
};
</script>

<template>
    <div class="md:w-1/3 p-6 bg-gray-50">
        <div class="sticky top-6">
            <div class="bg-white p-6 rounded-xl shadow-sm">
                <h3 class="text-xl font-semibold text-dark mb-4">Réservation</h3>

                <div class="flex justify-between items-center mb-6">
                    <div>
                        <span class="text-2xl font-bold text-primary">15000 Fcfa</span>
                        <span class="text-gray-500 ml-2">/ séance</span>
                    </div>
                    <div class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center">
                        <Clock class="w-4 h-4 mr-1" />
                        60 min
                    </div>
                </div>
                <AvailabilitySelector @time-selected="handleTimeSelection" />

                <div class="mb-4">
                    <div class="flex items-center p-3 bg-gray-100 rounded-lg mb-4">
                        <input v-model="isDomicile" id="domicile" type="checkbox"
                            class="form-checkbox h-5 w-5 text-primary focus:ring-600 mr-5" />
                        <label for="domicile" class="text-gray-600 mr-2">Service à domicile ?</label>
                    </div>
                    <Transition name="fade-slide">
                        <div v-if="isDomicile" class="transition-box">
                            <input type="text" placeholder="Adresse de la prestation"
                                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            <span class="text-gray-500 text-sm">Ex: Akwa Douche.</span>
                            <p v-if="showError && !adresse.trim()" class="text-red-500 text-sm mt-1">
                                L'adresse est requise pour un service à domicile.
                            </p>
                        </div>
                    </Transition>
                </div>

                <button
                    class="w-full bg-[#FF6B6B] text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center"
                    @click="validerFormulaire">
                    <CalendarCheck class="w-5 h-5 mr-2" />
                    Réserver maintenant
                </button>

                <div class="mt-6 pt-6 border-t">
                    <h4 class="font-medium text-dark mb-3">Contact</h4>
                    <div class="space-y-2">
                        <div class="flex items-center text-gray-600">
                            <Phone class="w-5 h-5 mr-3" />
                            <span>+33 6 12 34 56 78</span>
                        </div>
                        <div class="flex items-center text-gray-600">
                            <Mail class="w-5 h-5 mr-3" />
                            <span>contact@allôbeaute.fr</span>
                        </div>
                        <div class="flex items-center text-gray-600">
                            <MapPin class="w-5 h-5 mr-3" />
                            <span>12 Rue de la Beauté, 75008 Douala</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Animation classes for transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>
