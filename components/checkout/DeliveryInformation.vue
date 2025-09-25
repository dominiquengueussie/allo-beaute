<script lang="ts" setup>
defineProps({
    shippingInfo: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Informations de livraison
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
          <!--   <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input type="text" id="firstName" v-model="shippingInfo.firstName"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Votre prénom" />
            </div>
            <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input type="text" id="lastName" v-model="shippingInfo.lastName"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Votre nom" />
            </div>
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" v-model="shippingInfo.email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="votre.email@exemple.com" />
            </div>
            <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" id="phone" v-model="shippingInfo.phone"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="06 12 34 56 78" />
            </div> -->
            <div class="md:col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Adresse <span>*</span></label>
                <input type="text" id="address" v-model="shippingInfo.address"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Numéro et nom de rue ou quartier" required/>
            </div>
            <div>
                <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">Contact <span>*</span></label>
                <input type="text" id="postalCode" v-model="shippingInfo.contact"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="690014598" required />
            </div>
           <!--  <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input type="text" id="city" v-model="shippingInfo.city"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Douala" />
            </div> -->
            <div class="md:col-span-2">
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes de livraison
                    (optionnel)</label>
                <textarea id="notes" v-model="shippingInfo.notes" rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Instructions spéciales pour la livraison..."></textarea>
            </div>
        </div>
    </div>
</template>
