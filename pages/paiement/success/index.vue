<script setup>
definePageMeta({
    title: 'reservation'
})

const backWithHome = () => {
    navigateTo('/')
}
</script>

<template>
    <div class="md:flex items-center justify-center min-h-screen bg-gray-100">
        <div class="md:w-7/10 py-6 px-24 mx-auto text-center md:text-left md:p-8 bg-white rounded-lg shadow-lg ">
            <div class="flex items-center justify-center mb-6">
                <div class="bg-green-100 rounded-full p-3 mr-4">
                    <i class="fas fa-check-circle text-green-500 text-2xl"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Merci pour votre commande !</h1>
                    <p class="text-gray-600">Votre commande a été enregistrée avec succès.</p>
                </div>
            </div>
            <div class="mt-6 text-center">
                <h3 class="font-semibold text-gray-800 mb-2">Informations sur votre commande</h3>
                <ul class="text-gray-600 text-sm space-y-2 mb-8">
                    <li class="flex items-center justify-center">
                        <i class="fas fa-info-circle text-purple-600 mt-1 mr-2"></i>
                        <span>Vous recevrez un e-mail de confirmation avec les détails de votre commande.</span>
                    </li>
                    <li class="flex items-center justify-center">
                        <i class="fas fa-info-circle text-purple-600 mt-1 mr-2"></i>
                        <span>Suivez l’avancement de la livraison depuis votre espace client.</span>
                    </li>
                </ul>
                <NuxtLink to="/"
                    class="bg-slate-900 text-white px-6 py-3 rounded-button whitespace-nowrap cursor-pointer rounded-md">
                    Retour à l'accueil
                </NuxtLink>
            </div>

        </div>
    </div>
</template>

<style scoped></style>