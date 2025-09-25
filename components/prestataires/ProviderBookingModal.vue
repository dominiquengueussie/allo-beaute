<script setup>
const props = defineProps({
    isOpen: Boolean,
    service: Object
})

const emit = defineEmits(['close', 'confirm'])

const bookingData = reactive({
    date: '',
    time: '09:00',
    notes: ''
})

// Set minimum date to today
const today = new Date().toISOString().split('T')[0]

function handleConfirm() {
    if (!bookingData.date) {
        alert('Veuillez sélectionner une date')
        return
    }

    emit('confirm', bookingData)
}
</script>
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
        :class="isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
        @click.self="emit('close')">
        <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">Réserver un service</h3>
                <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="mb-4" v-if="service">
                <p class="font-medium text-gray-700">Service : <span class="text-purple-600">{{ service.name }}</span>
                </p>
                <p class="font-medium text-gray-700">Prix : <span class="text-purple-600">{{ service.price }}€</span>
                </p>
            </div>

            <form class="space-y-4" @submit.prevent="handleConfirm">
                <div>
                    <label for="booking-date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" id="booking-date" v-model="bookingData.date" :min="today"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                </div>

                <div>
                    <label for="booking-time" class="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                    <select id="booking-time" v-model="bookingData.time"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="09:00">09:00</option>
                        <option value="10:30">10:30</option>
                        <option value="12:00">12:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:30">15:30</option>
                        <option value="17:00">17:00</option>
                    </select>
                </div>

                <div>
                    <label for="booking-notes" class="block text-sm font-medium text-gray-700 mb-1">Notes
                        supplémentaires</label>
                    <textarea id="booking-notes" rows="3" v-model="bookingData.notes"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Précisez vos besoins particuliers..."></textarea>
                </div>

                <button type="submit"
                    class="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                    Confirmer la réservation
                </button>
            </form>
        </div>
    </div>
</template>