<script setup>
import { Search, Bell, Plus, Euro, ChevronDown, Clock9, ArrowDownNarrowWide, SquarePen, Trash2, ConciergeBell, TriangleAlert } from "lucide-vue-next";

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
   <Appointments />
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