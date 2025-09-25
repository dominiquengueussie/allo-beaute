<script setup>
const props = defineProps({
    isFormValid: Boolean
});

const emit = defineEmits(['submit', 'update:termsAccepted']);

const termsAccepted = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:termsAccepted', value);
    }
});
</script>

<template>
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-6">
            <div class="flex items-start mb-6">
                <div class="flex-shrink-0">
                    <i class="fas fa-info-circle text-xl text-purple-600"></i>
                </div>
                <div class="ml-3">
                    <h4 class="text-lg font-medium text-gray-800">Informations importantes</h4>
                    <p class="text-gray-600 mt-1">
                        Veuillez arriver 10 minutes avant votre rendez-vous. En cas d'empêchement, merci de nous
                        prévenir au moins 24h à l'avance.
                    </p>
                </div>
            </div>
            <div class="mb-6">
                <label class="flex items-start">
                    <input type="checkbox" v-model="termsAccepted"
                        class="mt-1 h-4 w-4 border text-slate-700 focus:ring-purple-500 border-gray-500 rounded" required />
                    <span class="ml-2 text-sm text-gray-600">
                        J'accepte les <NuxtLink to="#" class="text-slate-600 hover:underline font-semibold">conditions générales</NuxtLink> et la
                        <NuxtLink to="#" class="text-slate-600 hover:underline font-semibold">politique de confidentialité</NuxtLink>
                    </span>
                </label>
            </div>
            <div class="flex flex-col sm:flex-row justify-between items-center">
                <NuxtLink to="/services" class="text-slate-600 hover:text-gold mb-4 sm:mb-0 cursor-pointer">
                    <i class="fas fa-arrow-left mr-2"></i> Retour aux services
                </NuxtLink>
                <button @click="$emit('submit')" :disabled="!isFormValid" :class="[
                    'bg-slate-900 text-white px-6 py-3 rounded-button whitespace-nowrap cursor-pointer',
                    isFormValid ? 'hover:bg-slate-900' : 'opacity-50 cursor-not-allowed'
                ]">
                    Confirmer la réservation <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    </div>
</template>