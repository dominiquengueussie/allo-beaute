<script setup>
definePageMeta({
    layout: 'dashboard',
    title: 'Tableau de bord',
    meta: [
        { name: 'description', content: 'Tableau de bord de l\'esthéticienne' },
        { name: 'keywords', content: 'esthéticienne, tableau de bord, services, produits, rendez-vous' }
    ]
})

</script>

<template>
   <BookedServices />
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
}
</style>