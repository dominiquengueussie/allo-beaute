<script setup>
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
const items = [
    {
        value: 'item-1',
        label: 'Faut-il prendre rendez-vous à l\'avance ?',
        content: 'Oui, nous vous recommandons de réserver votre créneau au moins 48h à l\'avance pour garantir votre rendez-vous, surtout pendant les périodes chargées. Vous pouvez prendre rendez-vous par téléphone, email ou via notre formulaire de contact.'
    },
    {
        value: 'item-2',
        label: 'Comment se déroule une prestation à domicile ?',
        content: 'Pour une prestation à domicile, notre esthéticienne arrive avec tout le matériel nécessaire. Nous vous demandons simplement de prévoir un espace suffisant et calme. Un supplément de déplacement peut s\'appliquer selon votre zone géographique.'
    },
    {
        value: 'item-3',
        label: 'Quels moyens de paiement acceptez-vous ?',
        content: 'Nous acceptons les paiements par carte bancaire, espèces et chèques. Pour les prestations en institut, nous disposons également d\'un terminal de paiement sans contact. Pour les prestations à domicile, le paiement doit être effectué immédiatement après le service.'
    },
    {
        value: 'item-4',
        label: 'Puis-je annuler ou reporter mon rendez-vous ?',
        content: 'Oui, vous pouvez annuler ou reporter votre rendez-vous jusqu\'à 24h avant l\'heure prévue sans frais. Pour toute annulation moins de 24h avant le rendez-vous, des frais correspondant à 50% du montant de la prestation pourront être appliqués.'
    },
    {
        value: 'item-5',
        label: 'Proposez-vous des formules pour les événements (mariages, EVJF) ?',
        content: 'Absolument ! Nous proposons des formules spéciales pour les mariages, EVJF et autres événements. Ces formules peuvent être personnalisées selon vos besoins. Contactez-nous au moins un mois à l\'avance pour que nous puissions organiser au mieux votre événement.'
    }
]
</script>

<template>
    <div class="beauty-card fade-in" :style="{ animationDelay: '0.6s' }">
        <h2 class="text-2xl md:text-3xl font-semibold text-beauty-dark mb-6">
            Questions Fréquentes
        </h2>

   <Accordion type="multiple" class="w-full">
    <AccordionItem 
      v-for="item in items" 
      :key="item.value" 
      :value="item.value"
      class="border border-beauty-nude/40"
    >
      <AccordionTrigger 
        class="hover:text-beauty-gold text-beauty-dark font-medium data-[state=open]:text-beauty-gold"
      >
        {{ item.label }}
      </AccordionTrigger>
      
      <AccordionContent class="text-muted-foreground">
        {{ item.content }}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
    </div>
</template>

<style scoped>
.beauty-card {
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

.border-beauty-nude\/40 {
    border-color: rgba(234, 224, 210, 0.4);
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
}
</style>