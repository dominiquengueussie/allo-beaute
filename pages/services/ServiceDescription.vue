<script setup>
import {Check, CheckCircle, ChevronDown, CirclePlus, MapPin, Star } from 'lucide-vue-next';

</script>

<template>
    <div class="p-6">
        <h3 class="text-2xl font-semibold text-dark mb-4">Description</h3>
        <p class="text-gray-700 mb-6">
            Notre Manucure Premium est un soin complet qui sublimera vos mains et vos ongles.
            Ce service inclut un modelage des mains, un soin hydratant intense, une coupe et
            limage parfaite, ainsi qu'une pose de vernis longue durée de qualité professionnelle.
            Nous utilisons des produits haut de gamme pour garantir un résultat impeccable et durable.
        </p>

        <div class="grid md:grid-cols-2 gap-6 mb-8">
            <!-- Included Services -->
            <div class="bg-blue-50 p-5 rounded-xl">
                <h4 class="font-medium text-dark mb-3 flex items-center">
                    <CheckCircle class="w-5 h-5 text-blue-500 mr-2"/> Ce qui est inclus
                </h4>
                <ul class="space-y-2">
                    <li class="flex items-center text-gray-700">
                        <Check class="text-blue-500 mr-2 w-4 h-4"/>
                        <span>Service à domicile ou à l'institut</span>
                    </li>
                    <li class="flex items-center text-gray-700">
                        <Check class="text-blue-500 mr-2 w-4 h-4"/>
                        <span>Nettoyage et préparation des ongles</span>
                    </li>
                    <li class="flex items-center text-gray-700">
                       <Check class="text-blue-500 mr-2 w-4 h-4"/>
                        <span>Modelage des mains (5 min)</span>
                    </li>
                    <li class="flex items-center text-gray-700">
                      <Check class="text-blue-500 mr-2 w-4 h-4"/>
                        <span>Soin hydratant intense</span>
                    </li>
                    <li class="flex items-center text-gray-700">
                       <Check class="text-blue-500 mr-2 w-4 h-4"/>
                        <span>Coupe et limage des ongles</span>
                    </li>
                    <li class="flex items-center text-gray-700">
                       <Check class="text-blue-500 mr-2 w-4 h-4"/>
                        <span>Pose de vernis professionnel</span>
                    </li>
                </ul>
            </div>

            <!-- Additional Options -->
            <div class="bg-purple-50 p-5 rounded-xl">
                <h4 class="font-medium text-dark mb-3 flex items-center">
                    <CirclePlus class="w-5 h-5 text-purple-500 mr-2" /> Options supplémentaires
                </h4>
                <ul class="space-y-2">
                    <li class="flex justify-between items-center text-gray-700">
                        <span>French manucure</span>
                        <span class="font-medium">+15€</span>
                    </li>
                    <li class="flex justify-between items-center text-gray-700">
                        <span>Décoration nail art</span>
                        <span class="font-medium">+10€</span>
                    </li>
                    <li class="flex justify-between items-center text-gray-700">
                        <span>Renforcement gel</span>
                        <span class="font-medium">+20€</span>
                    </li>
                    <li class="flex justify-between items-center text-gray-700">
                        <span>Vernis semi-permanent</span>
                        <span class="font-medium">+25€</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Location Map -->
        <div class="mb-8">
            <h3 class="text-2xl font-semibold text-dark mb-4">Localisation</h3>
            <div class="map-container rounded-xl overflow-hidden shadow-sm" id="map">
                <!-- Map will be loaded here -->
                <img src="https://maps.googleapis.com/maps/api/staticmap?center=48.870415,2.307511&zoom=15&size=800x300&maptype=roadmap&markers=color:red%7C48.870415,2.307511&key=YOUR_API_KEY"
                    alt="Localisation du salon" class="w-full h-full object-cover">
            </div>
            <div class="mt-3 flex items-center text-gray-600">
                <MapPin class="mr-2 text-primary h-4 w-4"></MapPin>
                <span>12 Rue de la Beauté, 75008 Douala (Coordonnées GPS: 48.870415, 2.307511)</span>
            </div>
        </div>

        <!-- Reviews -->
        <div>
            <h3 class="text-2xl font-semibold text-dark mb-4">Avis clients (128)</h3>
            <div class="space-y-6">
                <!-- Review 1 -->
                <div class="bg-white p-5 rounded-xl shadow-sm">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h4 class="font-medium text-dark">Sophie Martin</h4>
                            <div class="flex items-center mt-1">
                                <div class="flex text-yellow-400 text-sm">
                                    <Star class="fas fa-star"></Star>
                                    <Star class="fas fa-star"></Star>
                                    <Star class="fas fa-star"></Star>
                                    <Star class="fas fa-star"></Star>
                                </div>
                                <span class="text-gray-500 text-sm ml-2">15 juin 2023</span>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-700">
                        Service exceptionnel ! La manucure est parfaite et tient très bien.
                        L'esthéticienne était très professionnelle et attentive. Je recommande vivement.
                    </p>
                </div>

                <!-- Review 2 -->
                <div class="bg-white p-5 rounded-xl shadow-sm">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h4 class="font-medium text-dark">Claire Dubois</h4>
                            <div class="flex items-center mt-1">
                                <div class="flex text-yellow-400 text-sm">
                                    <Star class="fas fa-star"></Star>
                                    <Star class="fas fa-star"></Star>
                                    <Star class="fas fa-star"></Star>
                                    <Star class="fas fa-star"></Star>
                                </div>
                                <span class="text-gray-500 text-sm ml-2">2 juin 2023</span>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-700">
                        Très bon service, résultat impeccable. Le seul petit bémol est l'attente
                        de 10 minutes car le salon était complet. À part ça, tout était parfait.
                    </p>
                </div>
            </div>

            <!-- Load More Reviews -->
            <div class="mt-6 text-center">
                <button class="bg-gray-100 text-dark px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center mx-auto">
                    <ChevronDown class="mr-2"></ChevronDown> Voir plus d'avis
                </button>
            </div>

            <!-- Add Review -->
            <div class="mt-8 bg-gray-50 p-5 rounded-xl">
                <h4 class="font-medium text-dark mb-3">Ajouter un avis</h4>
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Commentaire</label>
                    <textarea
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        rows="4" placeholder="Décrivez votre expérience..."></textarea>
                </div>
                <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition">
                    Envoyer l'avis
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>