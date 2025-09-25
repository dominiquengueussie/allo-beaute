<script setup>
const emit = defineEmits(['search-service']);

const handleSelect = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue && selectedValue !== 'Sélectionner un service') {
        emit('search-service', selectedValue);
    }
};

const apiEndpoint = "https://demo-allobeaute.tikaplace.com/api/services/catalog";

onMounted(async () => {
    await execute();
    //console.log("API Response:", apiResponse);
});
const {
    data: apiResponse,
    status,
    error,
    execute,
} = useFetch(apiEndpoint, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
    immediate: false,
});
const Services = computed(() => apiResponse.value?.data || []); 
</script>

<template>
    <!-- Hero Section -->
    <section class="bg-slate-900 py-16">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center">
                <h1 class="title-font text-4xl md:text-5xl font-bold text-white mb-4">Trouvez le service de
                    beauté parfait</h1>
                <p class="text-lg text-white mb-8">Réservez des services de beauté premium près de chez vous</p>

                <!-- Search Bar -->
                <div class="bg-white rounded-full shadow-lg p-2 flex max-w-2xl mx-auto mb-8">
                    <div class="flex-1 px-4 py-2 border-r border-gray-100">
                        <select class="w-full bg-transparent text-gray-700 rounded-full outline-none border border-gray-100" @change="handleSelect">
                            <option disabled selected>Sélectionner un service</option>
                            <option v-for="service in Services" :key="service.id">{{ service.name }}</option>
                        </select>
                    </div>
                    <div class="flex-1 px-4 py-2 border-r border-gray-100">
                        <select class="w-full bg-transparent text-gray-700 rounded-full outline-none border border-gray-100">
                            <option>Localisation</option>
                            <option>Akwa</option>
                            <option>Bonabérie</option>
                            <option>Bonanjo</option>
                            <option>Village</option>
                            <option>Etoudie</option>
                        </select>
                    </div>
                    <!--  <button class="bg-gold hover:bg-yellow-golden text-slate-900 px-6 py-3 rounded-full transition flex items-center">
                        <Search class="mr-2"/> Rechercher
                    </button> -->
                </div>

                <div class="flex justify-center space-x-4">
                    <span class="text-sm text-gray-500">Populaire :</span>
                    <a href="#" class="text-sm text-gold">Maquillage</a>
                    <a href="#" class="text-sm text-gold">Onglerie</a>
                    <a href="#" class="text-sm text-gold">Massage</a>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped></style>