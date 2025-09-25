<script setup>
import { MapPin, Phone, Mail, Clock } from "lucide-vue-next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useToast } from "vue-toastification";
// Form data
const form = ref({
    name: "",
    email: "",
    phone: "",
    service: "",
    location: "institute",
    message: "",
    consent: false,
});
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

const errors = ref({});
const isSubmitting = ref(false);
const toast = useToast();

// Validation rules
const validateForm = () => {
    errors.value = {};
    let isValid = true;

    if (!form.value.name) {
        errors.value.name = "Ce champ est obligatoire";
        isValid = false;
    } else if (form.value.name.length < 2) {
        errors.value.name = "Minimum 2 caractères";
        isValid = false;
    }

    if (!form.value.email) {
        errors.value.email = "Ce champ est obligatoire";
        isValid = false;
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.value.email)
    ) {
        errors.value.email = "Adresse email invalide";
        isValid = false;
    }

    if (!form.value.phone) {
        errors.value.phone = "Ce champ est obligatoire";
        isValid = false;
    } else if (
        !/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(form.value.phone)
    ) {
        errors.value.phone = "Numéro de téléphone invalide";
        isValid = false;
    }

    if (!form.value.service) {
        errors.value.service = "Ce champ est obligatoire";
        isValid = false;
    }

    if (!form.value.message) {
        errors.value.message = "Ce champ est obligatoire";
        isValid = false;
    } else if (form.value.message.length < 10) {
        errors.value.message = "Votre message est trop court";
        isValid = false;
    }

    if (!form.value.consent) {
        errors.value.consent = "Veuillez accepter les conditions";
        isValid = false;
    }

    return isValid;
};

// Form submission
const onSubmit = async () => {
    if (!validateForm()) return;

    isSubmitting.value = true;

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Form submitted:", form.value);
        toast.success("Votre message a bien été envoyé !");

        // Reset form
        form.value = {
            name: "",
            email: "",
            phone: "",
            service: "",
            location: "institute",
            message: "",
            consent: false,
        };
    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-12 items-start max-w-7xl mx-auto px-4 py-12">
        <div class="bg-slate-900 p-6 rounded-lg shadow-md fade-in">
            <h2 class="text-xl md:text-2xl font-semibold mb-6 text-gold playfair">
                Formulaire de Contact
            </h2>

            <form @submit.prevent="onSubmit" class="space-y-6 montserrat text-gold">
                <div class="space-y-4">
                    <!-- Name -->
                    <div class="space-y-2">
                        <label for="name" class="block text-sm font-medium">Nom et prénom</label>
                        <input required id="name" v-model="form.name" placeholder="Votre nom complet"
                            class="block w-full rounded-md border border-gray-300 text[#6d5656] py-3 px-2 shadow-md sm:text-sm focus:border-gray-500" />
                        <p v-if="errors.name" class="text-sm">
                            {{ errors.name }}
                        </p>
                    </div>

                    <!-- Email -->
                    <div class="space-y-2">
                        <label for="email" class="block text-sm font-medium">Email</label>
                        <input required id="email" v-model="form.email" type="email" placeholder="votre@email.com"
                            class="block w-full rounded-md border border-gray-300 text[#6d5656] py-3 px-2 shadow-md sm:text-sm focus:border-gray-500" />
                        <p v-if="errors.email" class="text-sm">
                            {{ errors.email }}
                        </p>
                    </div>

                    <!-- Phone -->
                    <div class="space-y-2">
                        <label for="phone" class="block text-sm font-medium">Téléphone</label>
                        <input required id="phone" v-model="form.phone" type="tel"
                            placeholder="Votre numéro de téléphone"
                            class="block w-full rounded-md border border-gray-300 text[#6d5656] py-3 px-2 shadow-md sm:text-sm focus:border-gray-500" />
                        <p v-if="errors.phone" class="text-sm text-destructive">
                            {{ errors.phone }}
                        </p>
                    </div>

                    <!-- Service Type -->
                    <div class="space-y-2">
                        <label for="service" class="block text-sm font-medium">Type de
                            prestation</label>
                        <select id="service" v-model="form.service"
                            class="block w-full rounded-md border border-gray-300 text-slate-900 py-3 px-2 shadow-md sm:text-sm focus:border-gray-500">
                            <option value="" disabled selected>
                                Sélectionnez un service
                            </option>
                            <option value="facial">Soin du visage</option>
                            <option value="waxing">Épilation</option>
                            <option value="massage">Massage</option>
                            <option value="makeup">Maquillage</option>
                            <option value="manicure">Manucure & Pédicure</option>
                            <option value="other">Autre</option>
                        </select>
                        <p v-if="errors.service" class="text-sm">
                            {{ errors.service }}
                        </p>
                    </div>
                    <!-- Message -->
                    <div class="space-y-2">
                        <label for="message" class="block text-sm font-medium">Message</label>
                        <textarea required id="message" v-model="form.message"
                            placeholder="Décrivez vos besoins, préférences de créneau, questions..."
                            class="min-h-[120px]  resize-none block w-full border rounded-md border-gray-300 shadow-md p-2 sm:text-sm" />
                        <p v-if="errors.message" class="text-sm">
                            {{ errors.message }}
                        </p>
                    </div>

                    <!-- Consent -->
                    <div class="flex items-start space-x-2 pt-2">
                        <input id="consent" v-model="form.consent" type="checkbox"
                            class="h-4 w-4 border-gray-300 rounded" required />
                        <div class="grid gap-1.5 leading-none">
                            <label for="consent" class="text-sm font-normal leading-snug cursor-pointer">
                                J'accepte que mes informations soient utilisées pour me
                                recontacter
                            </label>
                            <p v-if="errors.consent" class="text-sm text-destructive">
                                {{ errors.consent }}
                            </p>
                        </div>
                    </div>
                </div>

                <button type="submit" :disabled="isSubmitting"
                    class="w-full bg-gold hover:bg-beauty-gold/90 text-slate-900 font-medium py-3 rounded-lg transition-all duration-200 ease-in-out flex items-center justify-center">
                    <span v-if="isSubmitting" class="flex items-center justify-center">
                        <span class="mr-2">Envoi en cours</span>
                        <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    </span>
                    <span v-else class="flex items-center justify-center">
                        <span class="mr-2">Envoyer</span>
                        <Icon name="lucide:send" class="w-4 h-4" />
                    </span>
                </button>
            </form>
        </div>

        <!-- Contact Info & Map -->
        <div>
            <div class="space-y-8 mb-8">
                <div class="bg-slate-900 p-6 rounded-lg shadow-md fade-in">
                    <div class="beauty-card fade-in">
                        <h2 class="text-xl md:text-2xl font-semibold mb-6 text-gold playfair">
                            Nos Coordonnées
                        </h2>

                        <div class="space-y-5">
                            <div class="flex items-start">
                                <div>
                                    <div class="flex items-center text-gold">
                                        <MapPin class=" mr-3 h-6 w-6 flex-shrink-0" />
                                        <h2 class="font-semibold text-beauty-dark playfair">Adresse</h2>
                                    </div>
                                    <div class="text-muted-foreground mt-1 ml-9 montserrat">
                                        Rue des manguiers, Bali. <br />
                                        Proche de la pharmacie Gabelou, Douala, Cameroon
                                        <p>
                                            <a href="https://maps.app.goo.gl/YgJPMQPZHFkEGKoW6" target="_blank"
                                                rel="noopener noreferrer"
                                                class=" px-0 h-auto font-normal text-blue-300 hover:text-beauty-dark">
                                                Voir sur Google Maps
                                            </a>
                                        </p>
                                    </div>

                                </div>
                            </div>
                            <div class="flex items-start">
                                <div>
                                    <div class="flex items-center text-gold">
                                        <Phone class="mr-3 h-6 w-6 flex-shrink-0" />
                                        <h2 class="font-semibold text-beauty-dark playfair">Téléphone</h2>
                                    </div>
                                    <div class="text-muted-foreground mt-1 ml-9 montserrat">
                                        <p>
                                            <a href="tel:+33123456789"
                                                class="text-muted-foreground mt-1 hover:text-beauty-gold transition-colors block">
                                                +237 691 323 407
                                            </a>
                                        </p>
                                    </div>

                                </div>
                            </div>
                            <div class="flex items-start text-gold">
                                <Mail class="mr-3 h-6 w-6 flex-shrink-0" />
                                <div>
                                    <h3 class="font-semibold text-beauty-dark playfair">Email</h3>
                                    <a href="mailto:obsession.institut2beaute@gmail.com"
                                        class="text-muted-foreground mt-1 hover:text-beauty-gold transition-colors block montserrat">
                                        obsession.institut2beaute@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div class="flex items-start text-gold">
                                <div>
                                    <div class="flex items-center">
                                        <Clock class="mr-3 h-6 w-6 flex-shrink-0" />
                                        <h2 class="font-semibold text-beauty-dark playfair">Horaires d'ouverture</h2>
                                    </div>
                                    <div class="text-muted-foreground mt-1 ml-9">
                                        <div class="text-muted-foreground mt-1 space-y-1 montserrat">
                                            <p class="text-green-400 font-semibold mb-2">Actuellement ouvert</p>
                                            <div class="grid grid-cols-2 gap-2">
                                                <span>Lundi</span>
                                                <span>9:00 - 20:00</span>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2">
                                                <span>Mardi</span>
                                                <span>09:00 - 20:00</span>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2">
                                                <span>Mercredi</span>
                                                <span>09:00 - 20:00</span>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2">
                                                <span>Jeudi</span>
                                                <span>10:00 - 20:00</span>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2">
                                                <span>Vendredi</span>
                                                <span>09:00 - 20:00</span>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2">
                                                <span>Samedi</span>
                                                <span>09:00 - 20:00</span>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2">
                                                <span>Dimanche</span>
                                                <span>09:00 - 20:00</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class=" bg-slate-900 p-6 rounded-lg shadow-md fade-in overflow-hidden">
                <h2 class="text-2xl md:text-3xl font-semibold text-beauty-dark mb-6 playfair text-gold">
                    Nous Trouver
                </h2>

                <div class="aspect-video w-full rounded-lg overflow-hidden border">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15919.751079700685!2d9.6776831!3d4.0331215!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10611314c34d0dc1%3A0xaf3d046a810cb417!2sRue%20des%20manguiers!5e0!3m2!1sfr!2scm!4v1758712560078!5m2!1sfr!2scm"
                        width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade" title="Notre institut" class="w-full h-full"
                        frameborder="0"></iframe>

                </div>
                <p class="mt-4 text-sm text-muted- montserrat text-white">
                    📍 Rue des Manguiers, Bali – à proximité de la pharmacie Gabelou, Douala, Cameroun. Parking
                    disponible à proximité.
                </p>
            </div>
            <div class=" bg-slate-900 p-6 rounded-lg shadow-md fade-in mt-8 overflow-hidden">
                <h2 class="text-2xl md:text-3xl font-semibold text-beauty-dark mb-6 text-gold playfair">
                    Questions Fréquentes
                </h2>

                <Accordion type="multiple" class="w-full montserrat text-white">
                    <AccordionItem v-for="item in items" :key="item.value" :value="item.value"
                        class="border-b border-beauty-nude/40">
                        <AccordionTrigger
                            class="hover:text-beauty-gold text-beauty-dark font-medium data-[state=open]:text-beauty-gold ">
                            {{ item.label }}
                        </AccordionTrigger>

                        <AccordionContent class="text-muted-foreground">
                            {{ item.content }}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>

    </div>
</template>

<style scoped>
.playfair {
    font-family: 'Playfair Display', serif;
}

.montserrat {
    font-family: 'Montserrat', sans-serif;
}

.beauty-gradient {
    background: linear-gradient(135deg, #f5f0e6 0%, #e8d8b5 100%);
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out;
}

.fade-in {
    opacity: 0;
    transform: translateY(10px);
    animation: fadeIn 0.5s forwards;
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
