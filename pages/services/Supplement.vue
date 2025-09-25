<script>
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
    title: 'Services supplémentaitaires',
    meta: [
        { name: 'description', content: 'services supplémentaire de l\'institut' },
        { name: 'keywords', content: 'esthéticienne, tableau de bord, services, produits, rendez-vous' }
    ]
})
</script>


<template>
    <div>
        <Supplement/>
    </div>
</template>


<style  scoped>

</style>