<script setup >
definePageMeta({
  layout: 'customheader',
});

import { useSearchStore } from '~/stores/search';
// On importe le store de recherche
const searchStore = useSearchStore();
</script>

<template>
  <div class="min-h-screen flex flex-col -mb-16">
    <Banniere />
    <main class="flex-grow gradient-bg">
      <!-- Si une recherche a été effectuée, on affiche les résultats -->
      <SearchResults v-if="searchStore.hasSearched" />
      <!-- Sinon, on affiche le contenu normal de la page d'accueil -->
      <template v-else>
        <Categories />
        <NewProducts />
        <PromoProducts />
        <BestProfesssional />
        <CallToAction />
      </template>
    </main>
  </div>
</template>

<style>
.gradient-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
body {
    font-family: "Montserrat", sans-serif;
    color: #333;
    scroll-behavior: smooth;
}

h1,
h2,
h3,
h4 {
    font-family: "Playfair Display", serif;
}
</style>