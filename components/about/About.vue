<script setup>
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { MoveRight, Check, Leaf, Star, UserPen, Linkedin, Instagram, Phone, Mail } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
const toast = useToast();
// Configuration du formulaire
const form = ref({
    name: "",
    email: "",
    phone: "",
    service: "",
});

const submitForm = () => {
    toast.success(
        "Merci pour votre demande ! Nous vous contacterons dans les plus brefs délais pour confirmer votre rendez-vous."
    );
    form.value = { name: "", email: "", phone: "", service: "" };
};

// Animation au scroll
onMounted(() => {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll(".card-hover, .team-member");

        elements.forEach((element) => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;

            if (elementPosition < screenPosition) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };

    const animatedElements = document.querySelectorAll(
        ".card-hover, .team-member"
    );
    animatedElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

    setTimeout(() => {
        animateOnScroll();
    }, 100);

    window.addEventListener("scroll", animateOnScroll);
});
</script>

<template>
    <div class="bg-nude-100">
        <!-- Section Hero -->
        <section class="relative min-h-[60vh] flex items-center justify-center text-center text-white hero-image">
            <div class="container mx-auto px-4 relative z-10">
                <h1 class="text-4xl md:text-6xl font-serif font-bold mb-6">
                    L'art du bien-être chez vous
                </h1>
                <p class="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
                    Depuis 2025, nous redéfinissons l'expérience beauté avec des soins
                    sur-mesure à domicile et dans nos locaux.
                </p>
                <NuxtLink to="/contact"
                    class="bg-gold hover:bg-[#d4aa58] text-slate-900 px-8 py-3 rounded-full font-medium transition inline-block">
                    Prendre rendez-vous</NuxtLink>
            </div>
        </section>

        <!-- Section Notre histoire -->
        <section class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-serif font-bold mb-4">
                        Notre histoire
                    </h2>
                    <div
                        class="w-24 h-1 bg-gradient-to-r from-gold from-10% via-yellow via-30% to-yellow-golden to-90% mx-auto">
                    </div>
                </div>

                <div class="max-w-4xl mx-auto relative pl-12">
                    <!-- Étape 1 -->
                    <div class="timeline-item relative pb-12">
                        <div
                            class="absolute -left-12 w-8 h-8 rounded-full bg-gradient-to-r from-[#FFCC00] to-gold flex items-center justify-center">
                            <span class="text-white font-bold">1</span>
                        </div>
                        <h3 class="text-2xl font-serif font-semibold mb-2">
                            2025 - La genèse
                        </h3>
                        <p class="text-gray-600 mb-4">
                            Fondée par <span class="font-bold playfair">obsession institut</span>, esthéticienne passionnée, Allô
                            Beauté
                            naît d'une vision : apporter l'excellence des instituts
                            directement au domicile des clients ou dans les locaux.
                        </p>
                        <div class="bg-gold p-4 rounded-lg">
                            <p class="italic text-slate-900">
                                "Je voulais créer une expérience où la beauté rencontre le
                                confort, où chaque détail compte."
                            </p>
                        </div>
                    </div>

                    <!-- Étape 2 -->
                    <div class="timeline-item relative pb-12">
                        <div
                            class="absolute -left-12 w-8 h-8 rounded-full bg-gradient-to-r from-gold via-[#FFCC00] to-yellow flex items-center justify-center">
                            <span class="text-white font-bold">2</span>
                        </div>
                        <h3 class="text-2xl font-serif font-semibold mb-2">
                            Notre Ambition
                        </h3>
                        <p class="text-gray-600 mb-4">
                            Nous visons à agrandir notre équipe avec des professionnels triés sur le volet, développer
                            une gamme de soins exclusifs et obtenir les meilleures certifications bio.
                        </p>
                        <div class="flex space-x-2 mt-4">
                            <span class="bg-yellow-golden text-slate px-3 py-1 rounded-full text-sm">Nouveaux
                                soins</span>
                            <span class="bg-yellow text-slate-900 px-3 py-1 rounded-full text-sm">Équipe
                                d'experts</span>
                        </div>
                    </div>

                    <!-- Étape 3 -->
                    <div class="timeline-item relative">
                        <div
                            class="absolute -left-12 w-8 h-8 rounded-full bg-gradient-to-r from-[#FFCC00] to-gold flex items-center justify-center">
                            <span class="text-white font-bold">3</span>
                        </div>
                        <h3 class="text-2xl font-serif font-semibold mb-2">
                            L'excellence
                        </h3>
                        <p class="text-gray-600">
                            <span class="font-medium">Notre objectif</span> : devenir la référence du bien-être à
                            domicile grâce à une approche innovante et un service qui vise la satisfaction totale de
                            chaque client.

                        </p>
                        <div class="flex items-center mt-4">
                            <div class="flex -space-x-2 mr-4">
                                <img class="w-8 h-8 rounded-full border-2 border-white"
                                    src="https://randomuser.me/api/portraits/women/43.jpg" alt="Client" />
                                <img class="w-8 h-8 rounded-full border-2 border-white"
                                    src="https://randomuser.me/api/portraits/women/68.jpg" alt="Client" />
                                <img class="w-8 h-8 rounded-full border-2 border-white"
                                    src="https://randomuser.me/api/portraits/women/12.jpg" alt="Client" />
                                <div
                                    class="w-8 h-8 rounded-full border-2 border-white bg-nude-300 flex items-center justify-center text-xs font-bold">
                                    5k+
                                </div>
                            </div>
                            <span class="text-sm text-gray-500">Clients satisfaits</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Nos valeurs -->
        <section class="py-20 bg-slate-900">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl text-white md:text-4xl font-serif font-bold mb-4">
                        Nos valeurs
                    </h2>
                    <p class="text-white max-w-2xl mx-auto">
                        Ce qui nous distingue et guide chacune de nos interventions
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Carte 1 -->
                    <div class="bg-white p-8 rounded-lg shadow-sm transition duration-300 card-hover">
                        <div
                            class="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white text-2xl mb-6">
                            <Star class="w-6 h-6" />
                        </div>
                        <h3 class="text-xl font-serif font-semibold mb-3">Expertise</h3>
                        <p class="text-gray-600 mb-4">
                            Nos esthéticiennes sont diplômées des meilleures écoles et suivent
                            des formations continues pour maîtriser les dernières techniques.
                        </p>
                        <ul class="space-y-2">
                            <li class="flex items-center">
                                <Check class="text-[#FFCC00] mr-2 w-4 h-4" />
                                <span>Diplômes reconnus</span>
                            </li>
                            <li class="flex items-center">
                                <Check class="text-[#FFCC00] mr-2 w-4 h-4" />
                                <span>Formations annuelles</span>
                            </li>
                            <li class="flex items-center">
                                <Check class="text-[#FFCC00] mr-2 w-4 h-4" />
                                <span>Spécialisations pointues</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Carte 2 -->
                    <div class="bg-white p-8 rounded-lg shadow-sm transition duration-300 card-hover">
                        <div
                            class="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white text-2xl mb-6">
                            <UserPen name="lucide:user-cog" class="w-6 h-6" />
                        </div>
                        <h3 class="text-xl font-serif font-semibold mb-3">
                            Personnalisation
                        </h3>
                        <p class="text-gray-600 mb-4">
                            Chaque prestation est adaptée à votre peau, vos envies et votre
                            style de vie pour des résultats parfaitement naturels.
                        </p>
                        <ul class="space-y-2">
                            <li class="flex items-center">
                                <Check class="text-[#FFCC00] mr-2 w-4 h-4" />
                                <span>Diagnostic personnalisé</span>
                            </li>
                            <li class="flex items-center">
                                <Check class="text-[#FFCC00] mr-2 w-4 h-4" />
                                <span>Produits adaptés</span>
                            </li>
                            <li class="flex items-center">
                                <Check class="text-[#FFCC00] mr-2 w-4 h-4" />
                                <span>Conseils sur mesure</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Carte 3 -->
                    <div class="bg-white p-8 rounded-lg shadow-sm transition duration-300 card-hover">
                        <div
                            class="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white text-2xl mb-6">
                            <Leaf class="w-6 h-6" />
                        </div>
                        <h3 class="text-xl font-serif font-semibold mb-3">
                            Éco-responsabilité
                        </h3>
                        <p class="text-gray-600 mb-4">
                            Nous sélectionnons avec soin des produits naturels, bio et des
                            emballages recyclables pour minimiser notre impact
                            environnemental.
                        </p>
                        <ul class="space-y-2">
                            <li class="flex items-center">
                                <Check class="text-[#FFCC00] mr-2 w-4 h-4" />
                                <span>90% d'ingrédients naturels</span>
                            </li>
                            <li class="flex items-center">
                                <Check class="text-[#FFCC00] mr-2 w-4 h-4" />
                                <span>Zéro plastique à usage unique</span>
                            </li>
                            <li class="flex items-center">
                                <Check class="text-[#FFCC00] mr-2 w-4 h-4" />
                                <span>Partenaires locaux</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Notre équipe -->
        <section class="py-20 bg-slate-900">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl text-white md:text-4xl font-serif font-bold mb-4">
                        Notre équipe
                    </h2>
                    <p class="text-white max-w-2xl mx-auto">
                        Des professionnels passionnés qui viennent à votre domicile avec
                        tout le matériel nécessaire
                    </p>
                </div>

                <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    <!-- Membre 1 -->
                    <div class="relative overflow-hidden rounded-lg team-member">
                        <img src="https://img.freepik.com/photos-gratuite/portrait-femme-affaires-confiant-visage-souriant_53876-137693.jpg?semt=ais_hybrid&w=740"
                            alt="Amélie Laurent" class="w-full h-80 object-cover" />
                        <div
                            class="team-overlay absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 flex items-end p-6 transition duration-300 transform translate-y-5">
                            <div>
                                <h3 class="text-white font-serif text-xl font-semibold">
                                    Amélie Kamgang
                                </h3>
                                <p class="text-[#FFE380] mb-2">Fondatrice & Esthéticienne</p>
                                <p class="text-white text-sm">
                                    Spécialiste en soins anti-âge et en aromathérapie
                                </p>
                                <div class="flex space-x-3 mt-3">
                                    <a href="#" class="text-white hover:text-gold-300">
                                        <Instagram name="lucide:instagram" class="w-5 h-5" />
                                    </a>
                                    <a href="#" class="text-white hover:text-gold-300">
                                        <Linkedin class="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Membre 2 -->
                    <div class="relative overflow-hidden rounded-lg team-member">
                        <img src="https://img.freepik.com/photos-gratuite/modele-taille-plus-attrayant-chemise-blanche_53876-102075.jpg?semt=ais_hybrid&w=740"
                            alt="Sophie Kenfack" class="w-full h-80 object-cover" />
                        <div
                            class="team-overlay absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 flex items-end p-6 transition duration-300 transform translate-y-5">
                            <div>
                                <h3 class="text-white font-serif text-xl font-semibold">
                                    Sophie Kenfack
                                </h3>
                                <p class="text-[#FFE380] mb-2">Experte en maquillage</p>
                                <p class="text-white text-sm">
                                    Artiste maquilleuse pour événements et cours particuliers
                                </p>
                                <div class="flex space-x-3 mt-3">
                                    <a href="#" class="text-white hover:text-gold-300">
                                        <Instagram name="lucide:instagram" class="w-5 h-5" />
                                    </a>
                                    <a href="#" class="text-white hover:text-gold-300">
                                        <Linkedin name="lucide:linkedin" class="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Membre 3 -->
                    <div class="relative overflow-hidden rounded-lg team-member">
                        <img src="https://img.freepik.com/photos-premium/infirmiere-ebene-blanche-dans-ensemble-debout-style-souriant-brut-styliser-250-id-emploi-fbdcfe8f87de43acb2666c99659c_343960-110943.jpg?semt=ais_hybrid&w=740"
                            alt="Camille Leroy" class="w-full h-80 object-cover" />
                        <div
                            class="team-overlay absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 flex items-end p-6 transition duration-300 transform translate-y-5">
                            <div>
                                <h3 class="text-white font-serif text-xl font-semibold">
                                    Camille Leroy
                                </h3>
                                <p class="text-[#FFE380] mb-2">Masseuse professionnelle</p>
                                <p class="text-white text-sm">
                                    Diplômée en massage suédois et californien
                                </p>
                                <div class="flex space-x-3 mt-3">
                                    <a href="#" class="text-white hover:text-gold-300">
                                        <Instagram name="lucide:instagram" class="w-5 h-5" />
                                    </a>
                                    <a href="#" class="text-white hover:text-gold-300">
                                        <Linkedin name="lucide:linkedin" class="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Membre 4 -->
                    <div class="relative overflow-hidden rounded-lg team-member">
                        <img src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
                            alt="Juliette Moreau" class="w-full h-80 object-cover" />
                        <div
                            class="team-overlay absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 flex items-end p-6 transition duration-300 transform translate-y-5">
                            <div>
                                <h3 class="text-white font-serif text-xl font-semibold">
                                    Juliette Moreau
                                </h3>
                                <p class="text-[#FFE380] mb-2">
                                    Spécialiste des soins capillaires
                                </p>
                                <p class="text-white text-sm">
                                    Expertise en colorimétrie et soins cheveux naturels
                                </p>
                                <div class="flex space-x-3 mt-3">
                                    <a href="#" class="text-white hover:text-gold-300">
                                        <Instagram name="lucide:instagram" class="w-5 h-5" />
                                    </a>
                                    <a href="#" class="text-white hover:text-gold-300">
                                        <Linkedin name="lucide:linkedin" class="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-16">
                    <NuxtLink to="/about" class="inline-flex items-center text-gold font-medium hover:text-gold-600">
                        Voir toute l'équipe
                        <MoveRight name="lucide:arrow-right" class="ml-2 w-5 h-5" />
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- Section CTA Contact -->
        <section id="contact" class="py-20 -mb-16 bg-slate-900">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="md:flex">
                        <div class="md:w-1/2 bg-gold p-12 text-white flex flex-col justify-center">
                            <h2 class="text-3xl font-serif font-bold mb-4">
                                Prêt à vivre l'expérience Éclat Divin ?
                            </h2>
                            <p class="mb-6">
                                Réservez votre consultation à domicile dès maintenant. Nos
                                esthéticiennes se déplacent avec tout le matériel nécessaire.
                            </p>
                            <div class="space-y-4">
                                <div class="flex items-center">
                                    <div
                                        class="w-10 h-10 bg-gold border border-slate-900 text-slate-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <Phone name="lucide:phone" class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p class="text-sm text-white">Appelez-nous</p>
                                        <p class="font-medium">+237 691 323 407</p>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <div
                                        class="w-10 h-10 bg-gold border border-slate-900 text-slate-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 2.01C6.55 2.01 2.07 6.48 2.07 11.98c0 1.74.45 3.43 1.25 4.95L2.07 22l5.25-1.38c1.45.79 3.08.12 4.73.12 5.5 0 9.98-4.47 9.98-9.98S17.55 2.01 12.05 2.01z"/>
                                        </svg>                                        
                                    </div>
                                    <div>
                                        <p class="text-sm text-white">Ecrivez-nous directement</p>
                                        <p class="font-medium">+237 691 323 407</p>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <div
                                        class="w-10 h-10 bg-gold border border-slate-900 text-slate-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <Mail name="lucide:mail" class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p class="text-sm text-white">Envoyez-nous un email</p>
                                        <p class="font-medium">obsession.institut2beaute@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="md:w-1/2 p-12">
                            <h3 class="text-2xl font-serif font-semibold mb-6">
                                Demande de rendez-vous
                            </h3>
                            <form @submit.prevent="submitForm">
                                <div class="mb-4">
                                    <label class="block text-gray-700 mb-2" for="name">Nom complet</label>
                                    <input required type="text" id="name" v-model="form.name"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gold-500" />
                                </div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 mb-2" for="email">Email</label>
                                    <input required type="email" id="email" v-model="form.email"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gold-500" />
                                </div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 mb-2" for="phone">Téléphone</label>
                                    <input required type="tel" id="phone" v-model="form.phone"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gold-500" />
                                </div>
                                <div class="mb-6">
                                    <label class="block text-gray-700 mb-2" for="service">Service souhaité</label>
                                    <select id="service" v-model="form.service"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gold-500">
                                        <option value="">Sélectionnez un service</option>
                                        <option value="soin-visage">
                                            Soin du visage sur-mesure
                                        </option>
                                        <option value="maquillage">Maquillage professionnel</option>
                                        <option value="massage">Massage bien-être</option>
                                        <option value="soin-cheveux">Soin capillaire luxe</option>
                                        <option value="autre">Autre demande</option>
                                    </select>
                                </div>
                                <button type="submit"
                                    class="w-full bg-gold hover:bg-[#FFD84D] text-black py-3 px-6 rounded-lg font-medium transition">
                                    Envoyer la demande
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style>
/* Styles globaux */
.playfair {
    font-family: 'Playfair Display', serif;
}

.montserrat {
    font-family: 'Montserrat', sans-serif;
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

.hero-image {
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
        url("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80");
    background-size: cover;
    background-position: center;
}

.team-member:hover .team-overlay {
    opacity: 1;
    transform: translateY(0);
}

.timeline-item::before {
    content: "";
    position: absolute;
    left: -2rem;
    top: 0;
    height: 100%;
    width: 2px;
    background: linear-gradient(to bottom, #c9b18b, #f56565);
}

.timeline-item:first-child::before {
    top: 1.5rem;
    height: calc(100% - 1.5rem);
}

.timeline-item:last-child::before {
    height: 1.5rem;
}

.card-hover:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

@media (min-width: 1024px) {
    .hero-image {
        min-height: 80vh;
    }
}
</style>
