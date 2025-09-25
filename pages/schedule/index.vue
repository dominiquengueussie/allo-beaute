<script>
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
    title: 'Emploi de temps',
    meta: [
        { name: 'description', content: 'Emploi de temps de l\'esthéticienne' },
        { name: 'keywords', content: 'esthéticienne, tableau de bord, services, produits, rendez-vous' }
    ]
})
</script>


<template>
    <div>
        <Schedule/>
    </div>
</template>


<style  scoped>

</style>