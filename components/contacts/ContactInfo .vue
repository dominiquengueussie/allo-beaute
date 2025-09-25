<script setup>
// Pas besoin de logique particulière pour ce composant
</script>

<template>
    <div class="beauty-card fade-in">
        <h2 class="text-2xl md:text-3xl font-semibold text-beauty-dark mb-6">
            Nos Coordonnées
        </h2>

        <div class="space-y-5">
            <!-- Address -->
            <div class="flex items-start">
                <Icon name="lucide:map-pin" class="text-beauty-gold mr-3 h-6 w-6 flex-shrink-0" />
                <div>
                    <h3 class="font-semibold text-beauty-dark">Adresse</h3>
                    <p class="text-muted-foreground mt-1">
                      Rue des manguiers, Bali. <br />
                       Rue des manguiers, Bali. Proche de la pharmacie Gabelou, Douala, Cameroon
                    </p>
                    <NuxtLink to="https://maps.app.goo.gl/YgJPMQPZHFkEGKoW6" target="_blank" rel="noopener noreferrer"
                        class="px-0 h-auto font-normal text-beauty-gold hover:text-beauty-dark underline underline-offset-4 hover:no-underline">
                        Voir sur Google Maps
                    </NuxtLink>
                </div>
            </div>

            <!-- Phone -->
            <div class="flex items-start">
                <Icon name="lucide:phone" class="text-beauty-gold mr-3 h-6 w-6 flex-shrink-0" />
                <div>
                    <h3 class="font-semibold text-beauty-dark">Téléphone</h3>
                    <a href="tel:+33123456789"
                        class="text-muted-foreground mt-1 hover:text-beauty-gold transition-colors block">
                        +33 1 23 45 67 89
                    </a>
                </div>
            </div>

            <!-- Email -->
            <div class="flex items-start">
                <Icon name="lucide:mail" class="text-beauty-gold mr-3 h-6 w-6 flex-shrink-0" />
                <div>
                    <h3 class="font-semibold text-beauty-dark">Email</h3>
                    <a href="mailto:contact@beaute-institut.fr"
                        class="text-muted-foreground mt-1 hover:text-beauty-gold transition-colors block">
                        contact@beaute-institut.fr
                    </a>
                </div>
            </div>

            <!-- Hours -->
            <div class="flex items-start">
                <Icon name="lucide:clock" class="text-beauty-gold mr-3 h-6 w-6 flex-shrink-0" />
                <div>
                    <h3 class="font-semibold text-beauty-dark">Horaires d'ouverture</h3>
                    <div class="text-muted-foreground mt-1 space-y-1">
                        <div class="grid grid-cols-2 gap-2">
                            <span>Lundi - Vendredi</span>
                            <span>9:00 - 20:00</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <span>Samedi</span>
                            <span>10:00 - 18:00</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <span>Dimanche</span>
                            <span>Fermé</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* .beauty-card {
    @apply bg-white p-6 rounded-lg shadow-md;
}

.fade-in {
    animation: fadeIn 0.5s ease-out;
}

.text-beauty-dark {
    color: #3a3630;
}

.text-beauty-gold {
    color: #c8a97e;
}

.text-muted-foreground {
    color: #6b7280;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
} */
</style>