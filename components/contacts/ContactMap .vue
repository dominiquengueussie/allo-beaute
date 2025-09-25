<template>
  <div class=" bg-white p-6 rounded-lg shadow-md fade-in overflow-hidden">
    <h2 class="text-2xl md:text-3xl font-semibold text-beauty-dark mb-6">
      Nous Trouver
    </h2>
    
    <div class="aspect-video w-full rounded-lg overflow-hidden border">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142047342226!2d2.3354253157509493!3d48.87456430716001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e23f9435b5f%3A0x5cf43a6a47ad8949!2s15%20Rue%20de%20la%20Paix%2C%2075002%20Paris!5e0!3m2!1sen!2sfr!4v1647428086775!5m2!1sen!2sfr" 
        width="100%" 
        height="100%" 
        style="border: 0" 
        allowfullscreen 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade"
        title="Notre institut"
        class="w-full h-full"
      />
    </div>
    
    <p class="mt-4 text-sm text-muted-foreground">
      Facilement accessible depuis les stations de métro Opéra et Madeleine.
      Parking à proximité.
    </p>
  </div>
</template>

<script setup>
// Aucune logique nécessaire pour ce composant statique
</script>

<style scoped>

/*.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

 Vous pouvez définir ces variables dans votre fichier tailwind.config.js 
.border-beauty-nude\/30 {
  border-color: rgba(234, 224, 210, 0.3);
}

.text-beauty-dark {
  color: #3a3630;
}*/
</style>