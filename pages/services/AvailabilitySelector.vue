<script setup>
const days = [
    { value: 'lundi', label: 'Lun' },
    { value: 'mardi', label: 'Mar' },
    { value: 'mercredi', label: 'Mer' },
    { value: 'jeudi', label: 'Jeu' },
    { value: 'vendredi', label: 'Ven' },
    { value: 'samedi', label: 'Sam' }
]

const timeSlots = ref(['09:00', '11:00', '13:30', '15:00', '16:30', '18:00'])
const selectedDay = ref('vendredi')
const selectedTime = ref(null)

const selectDay = (day) => {
    selectedDay.value = day
    selectedTime.value = null
    // In a real app, you would fetch available time slots for the selected day
}

const selectTime = (time) => {
    selectedTime.value = time
    emit('time-selected', { day: selectedDay.value, time })
}

const emit = defineEmits(['time-selected'])
</script>

<template>
    <div class="mb-6">
        <h4 class="font-medium text-dark mb-3">Disponibilités</h4>
        <div class="grid grid-cols-3 gap-2">
            <button v-for="day in days" :key="day.value"
                class="availability-day py-2 rounded-lg border text-center transition-colors"
                :class="{ 'active bg-[#4ECDC4] text-white': selectedDay === day.value }" @click="selectDay(day.value)">
                {{ day.label }}
            </button>
        </div>
        <hr class="my-4" />
        <div class="mt-3 grid grid-cols-3 gap-2">
            <button v-for="time in timeSlots" :key="time"
                class="py-2 rounded-lg border text-center hover:bg-gray-100 transition"
                :class="{ 'bg-[#4ECDC4] text-white': selectedTime === time }" @click="selectTime(time)">
                {{ time }}
            </button>
        </div>
    </div>
</template>
