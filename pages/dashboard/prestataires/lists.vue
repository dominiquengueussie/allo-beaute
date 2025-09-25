<script setup>
definePageMeta({
    layout: 'dashboard',
    title: 'Liste des prestataires - AllôBeauté',
    meta: [
        { name: 'description', content: 'Liste de tous les prestataires disponibles' },
        { name: 'keywords', content: 'esthéticienne, tableau de bord, services, produits, rendez-vous' }
    ]
})
</script>



<template>
    <div class="flex justify-center items-center p-6">
        <p class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">Liste des prestataires</p>
    </div>
</template>

<style scoped>
body {
    font-family: "Montserrat", sans-serif;
    color: #333;
    scroll-behavior: smooth;
}
h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: "Playfair Display", serif;
    font-weight: 700;
}
</style>