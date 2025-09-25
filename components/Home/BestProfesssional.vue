<script setup>
import { ChevronRight } from "lucide-vue-next";

const apiEndpoint = 'https://demo-allobeaute.tikaplace.com/api/services/catalog';

const retryFetch = async () => {
  await execute();
};

onMounted(async () => {
  await execute();
  //console.log("API Response:", Bestprofessionnal.value);
});

const { data: apiResponse, status, error, execute } = useFetch(apiEndpoint, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
  immediate: false,
});
const Bestprofessionnal = computed(() => apiResponse.value?.data || []);
const handleBookService = (serviceId) => {
  navigateTo(`/prestataires/${serviceId}`);
};

</script>

<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">
          Nos Étoiles de la Beauté
        </h2>
        <span class="text-gray-600">Découvrez nos prestataires vérifiés, sélectionnés pour leur
          excellence et leur professionnalisme.</span>
      </div>
      <NuxtLink to="/services"
        class="text-premium text-slate-900 flex font-medium hover:text-premium/80 transition-colors">
        Voir tout
        <ChevronRight />
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-if="status === 'pending'" class="flex gap-4">
        <SkeletonCard v-for="n in 4" :key="n" />
      </div>
      <ProfessionalCard v-else v-for="professional in Bestprofessionnal" :key="professional.id"
        :professional="professional" @bookService="handleBookService" />
    </div>
  </div>
</template>
