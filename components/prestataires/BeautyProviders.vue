<script setup>
import { Search, MapPin } from "lucide-vue-next";

const navigateToServices = () => {
    navigateTo("/services");
};

const apiEndpoint = 'https://demo-allobeaute.tikaplace.com/api/services/catalog';

const retryFetch = async () => {
    await execute();
};

onMounted( async() => {
   await execute();
});

const { data: apiResponse, status, error, execute } = useFetch(apiEndpoint, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
    immediate: false,
});
const beautyServices = computed(() => apiResponse.value?.data || []);
const handleBookService = (serviceId) => {
    navigateTo(`/prestataires/${serviceId}`);
};
</script>

<template>
    <div class="relative overflow-hidden">
        <!--  <div class="absolute inset-0 bg-gradient-to-r from-cream to-transparent z-10"></div> -->
        <div class="absolute inset-0 overflow-hidden">
            <img src="https://img.freepik.com/photos-gratuite/arrangement-pinceaux-espace-copie_23-2148320947.jpg?semt=ais_items_boosted&w=740"
                alt="Beauty salon interior" class="w-full h-full" />
        </div>
        <div class="container mx-auto px-4 py-16 md:py-24 relative z-20">
            <div class="w-full text-center p-4 rounded-lg">
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 text-slate-800">
                    Découvrez les Meilleurs <p class="text-3xl mt-3 md:text-4xl lg:text-5xl font-serif font-bold mb-4">
                        prestatires des services de Beauté</p>
                </h2>
                <p class="text-lg text-slate-800 mb-8">
                    Réservez des prestations de beauté professionnelles avec les
                    meilleurs experts près de chez vous.
                </p>
                <!-- Search Bar -->
                <div class="bg-white max-w-3xl mx-auto p-2 rounded-full shadow-lg items-center hidden md:flex">
                    <div class="flex items-center flex-1 px-4 border-r border-gray-200">
                        <Search class="text-gray-400 mr-3" />
                        <input type="text" placeholder="Rechercher un prestatire..."
                            class="w-full py-3 px-3 focus:outline-none rounded-sm text-sm border-none" />
                    </div>
                    <div class="flex items-center flex-1 px-4">
                        <MapPin class="text-gray-400 mr-3" />
                        <input type="text" placeholder="Votre ville"
                            class="w-full py-3 px-3 rounded-sm focus:outline-none text-sm border-none" />
                    </div>
                    <button
                        class="bg-gold text-slate-900 px-6 py-3 flex items-center rounded-full hover:bg-yellow-golden transition-colors duration-300 cursor-pointer !rounded-button whitespace-nowrap">
                        <Search class=" text-black mr-2" />
                        <span>Rechercher</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="mb-16">
        <main class="max-w-[1500px] mx-auto px-4 py-6 min-h-screen">
            <h2 class="font-bold text-[18px] mb-6 mt-10">Services de beauté populaires</h2>
            <div v-if="status === 'pending'" class="flex gap-4">
               <SkeletonCard v-for="n in 4" :key="n" />
            </div>
            <div v-else-if="status === 'error'" class="text-red-500 p-4 text-center">
                <p>Erreur lors du chargement : {{ error?.message || 'Erreur inconnue' }}</p>
                <button @click="retryFetch" class="mt-2 text-gold hover:underline bg-slate-900 px-4 py-2 rounded-md">
                    Réessayer
                </button>
            </div>
            <div v-else-if="status === 'success' && apiResponse?.data?.length">
                <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                    <ProvidersGrid v-for="service in beautyServices" :key="service.id" :service="service"
                        @bookService="handleBookService" />
                </section>
            </div>
            <div v-else class="bg-white rounded-lg shadow-sm p-10 text-center">
                <div class="mb-4 text-gray-400 flex items-center justify-center">
                    <ConciergeBell class="text-5xl" />
                </div>
                <h3 class="text-xl font-medium text-gray-800 mb-2">
                    Aucun service disponible pour le moment.
                </h3>
            </div>
        </main>
        <LoadMoreButton @click="navigateToServices" />
    </div>
    <section class="bg-slate-900 py-16">
        <div class="container mx-auto px-4">
            <h2 class="title-font text-3xl font-semibold text-center text-white mb-12">Nos clients témoignent</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Testimonial 1 -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="flex items-center mb-4">
                        <div class="flex">
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">"Camille est une professionnelle exceptionnelle. Son travail sur mes
                        ongles est
                        toujours impeccable et son salon est d'une propreté irréprochable."</p>
                    <div class="flex items-center">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Marie D."
                            class="w-10 h-10 rounded-full mr-3">
                        <div>
                            <p class="font-medium text-gray-800">Fatou B..</p>
                            <p class="text-sm text-gray-500">Yaoundé</p>
                        </div>
                    </div>
                </div>

                <!-- Testimonial 2 -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="flex items-center mb-4">
                        <div class="flex">
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">"Sophie a fait un maquillage sublime pour mon mariage. Elle a su
                        comprendre
                        exactement ce que je voulais et le résultat était encore mieux que ce que j'imaginais."</p>
                    <div class="flex items-center">
                        <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Julie T."
                            class="w-10 h-10 rounded-full mr-3">
                        <div>
                            <p class="font-medium text-gray-800">Aïcha T..</p>
                            <p class="text-sm text-gray-500">Douala</p>
                        </div>
                    </div>
                </div>

                <!-- Testimonial 3 -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="flex items-center mb-4">
                        <div class="flex">
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                            <Star class="text-amber-400 fill-amber-400" />
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">"Anaïs possède des mains en or ! Son massage a soulagé mes tensions
                        dorsales
                        chroniques. Je recommande vivement ses services à tous ceux qui souffrent de stress."</p>
                    <div class="flex items-center">
                        <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah L."
                            class="w-10 h-10 rounded-full mr-3">
                        <div>
                            <p class="font-medium text-gray-800"> Nadia K.</p>
                            <p class="text-sm text-gray-500">Bafoussam</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="-mb-16 bg-slate-900 h-96 flex items-center justify-center text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="title-font text-3xl font-bold text-white mb-6">Vous êtes professionnel de beauté ?</h2>
            <p class="text-white mb-8 max-w-2xl mx-auto">Rejoignez notre plateforme et augmentez votre visibilité auprès
                de
                milliers de clients à la recherche de services premium.</p>
            <NuxtLink to="/becomeProvider"
                class="bg-gold text-slate-900 hover:bg-gray-100 px-8 py-3 rounded-full font-medium shadow-lg transition">
                Devenir prestataire
            </NuxtLink>
        </div>
    </section>
</template>
