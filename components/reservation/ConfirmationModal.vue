<script setup>
const {serviceTotal} = useCart();
const props = defineProps({
    serviceCart: Array,
    selectedDate: Date,
    selectedTimes: Array,
    contactInfo: Object,
});

const emit = defineEmits(['close']);

const formatSelectedDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const downloadICS = () => {
    // Générer un fichier ICS pour le calendrier
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Rendez-vous BeautéShop
DESCRIPTION:${props.serviceCart.map(s => s.name).join(', ')}
DTSTART:${formatDateForICS(props.selectedDate, props.selectedTimes[0])}
DTEND:${formatDateForICS(props.selectedDate, props.selectedTimes[0], props.serviceCart[0].duration)}
LOCATION:BeautéShop
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Rendez-vous-BeautéShop-${formatSelectedDate(props.selectedDate)}.ics`;
    link.click();
};

const formatDateForICS = (date, time, duration = '60 min') => {
    const mins = parseInt(duration);
    const endTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);

    endTime.setHours(hours, minutes);
    if (!isNaN(mins)) {
        endTime.setMinutes(endTime.getMinutes() + mins);
    }

    return endTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};
</script>


<template>
    <div class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                @click="$emit('close')"></div>
            <div class="flex items-center justify-center min-h-screen p-4">
                <div
                    class="relative bg-white rounded-lg max-w-6xl w-full overflow-hidden shadow-xl transform transition-all fade-in">
                    <!-- Main Content -->
                    <div class="md:flex">
                        <!-- Left Section (70%) -->
                        <div class="md:w-7/12 p-6 md:p-8">
                            <div class="flex items-center mb-6">
                                <div class="bg-green-100 rounded-full p-3 mr-4">
                                    <i class="fas fa-check-circle text-green-500 text-2xl"></i>
                                </div>
                                <div>
                                    <h1 class="text-2xl font-bold text-gray-800">Merci pour votre réservation !</h1>
                                    <p class="text-gray-600">Votre rendez-vous a été confirmé et vous recevrez un
                                        rappel.</p>
                                </div>
                            </div>

                            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                                <p class="text-gray-600 mb-2">Numéro de réservation: <span
                                        class="font-semibold">BS-RES-{{ new Date().getFullYear() }}-{{
                                        Math.floor(Math.random() * 10000) }}</span></p>
                                <p class="text-gray-600">Date du rendez-vous: <span class="font-semibold">{{
                                        formatSelectedDate(selectedDate) }}</span></p>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 class="font-semibold text-gray-800 mb-2">Vos informations</h3>
                                    <p class="text-gray-600">{{ contactInfo.firstName }} {{ contactInfo.lastName }}</p>
                                    <p class="text-gray-600">{{ contactInfo.email }}</p>
                                    <p class="text-gray-600">{{ contactInfo.phone }}</p>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800 mb-2">Détails du rendez-vous</h3>
                                    <ul class="space-y-1">
                                        <li v-for="(service, index) in serviceCart" :key="index" class="text-gray-600">
                                            {{ service.name }} à {{ selectedTimes[index] }}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-3">
                                <button @click="downloadICS"
                                    class="bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-md flex items-center">
                                    <i class="fa-solid fa-download mr-2"></i> Télécharger ma réservation
                                </button>
                                <button @click="$emit('close')"
                                    class="border border-slate-950 text-slate-950 hover:bg-purple-50 px-4 py-2 rounded-md">
                                    Retour à l'accueil
                                </button>
                            </div>
                        </div>

                        <!-- Right Section (30%) -->
                        <div class="md:w-5/12 bg-gray-50 p-6 md:p-8">
                            <h2 class="text-lg font-semibold text-gray-800 mb-4">Récapitulatif de la réservation</h2>

                            <div class="space-y-4 mb-6">
                                <div v-for="(service, index) in serviceCart" :key="index" class="flex items-start">
                                    <img :src="service.medias?.link" :alt="service.name"
                                        class="w-16 h-16 rounded-md object-cover mr-3">
                                    <div class="flex-1">
                                        <h3 class="text-gray-800 font-medium">{{ service.name }}</h3>
                                        <p class="text-gray-600 text-sm">{{ service.duration }} min</p>
                                        <p class="text-gray-800 font-medium">{{ service.price }}</p>
                                        <p class="text-gray-600 text-sm">{{ formatSelectedDate(selectedDate) }} à {{
                                            selectedTimes[index] }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="border-t border-gray-200 pt-4 mb-4">
                                <div class="flex justify-between font-semibold text-lg mt-4">
                                    <span>Total</span>
                                    <span>{{ serviceTotal }}</span>
                                </div>
                            </div>

                            <div class="mt-6">
                                <h3 class="font-semibold text-gray-800 mb-2">Informations importantes</h3>
                                <ul class="text-gray-600 text-sm space-y-2">
                                    <li class="flex items-start">
                                        <i class="fas fa-info-circle text-purple-600 mt-1 mr-2"></i>
                                        <span>Veuillez arriver 10 minutes avant votre rendez-vous</span>
                                    </li>
                                    <li class="flex items-start">
                                        <i class="fas fa-info-circle text-purple-600 mt-1 mr-2"></i>
                                        <span>Annulation possible jusqu'à 24h avant</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.rounded-button {
    border-radius: 0.5rem;
}
</style>