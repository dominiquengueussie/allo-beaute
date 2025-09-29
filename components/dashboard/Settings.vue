<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
    <div class="min-h-screen bg-gray-50 flex">
        <!-- Main Content -->
        <div class="ml-64 flex-1">
            <!-- Header -->
            <header class="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-5">
                <div>
                    <!-- <NuxtLink to="/dashboard/reviews" data-readdy="true"
                        class="text-gray-600 hover:text-pink-600 transition-colors duration-200 cursor-pointer flex items-center !rounded-button whitespace-nowrap">
                        <MoveLeft class="mr-2 h-4 w-4" />
                        <span>Retour aux avis clients</span>
                    </NuxtLink> -->
                    <NuxtLink to="/"
          class="text-slate-600 hover:text-slate-900 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap flex items-center">
          <ArrowBigLeft class="w-4 h-4 mr-1" />
          Retour à l'accueil
        </NuxtLink>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <button
                            class="text-gray-500 hover:text-gold transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            <Bell class=""></Bell>
                            <span
                                class="absolute -top-1 -right-1 bg-slate-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                        </button>
                    </div>
                    <div class="flex items-center space-x-3 cursor-pointer">
                        <div class="w-10 h-10 rounded-full overflow-hidden">
                            <img :src="userAvatar" alt="Avatar utilisateur" class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p class="font-medium text-sm">{{ user?.fullname }}</p>
                            <p class="text-xs text-gray-500">{{ user?.enterprise?.type }}</p>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Settings Content -->
            <main class="p-6">
                <div class="mb-6">
                    <h1 class="text-2xl font-bold text-gray-800">Paramètres du compte</h1>
                    <p class="text-gray-600">
                        Gérez vos informations personnelles et les préférences de votre
                        compte
                    </p>
                </div>

                <!-- Settings Navigation -->
               <!--  <div class="bg-white rounded-lg shadow-sm p-4 mb-8">
                    <div class="flex flex-wrap gap-4">
                        <a href="#informations-personnelles"
                            class="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                            <User class="mr-2 h-4 w-4" />
                            Informations personnelles
                        </a>
                        <a href="#coordonnees-professionnelles"
                            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                            <Building class="mr-2 h-4 w-4" /> Coordonnées professionnelles
                        </a>
                        <a href="#notifications"
                            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                            <Bell class="mr-2 h-4 w-4"></Bell>
                            Notifications
                        </a>
                        <a href="#securite"
                            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                            <Lock class="mr-2 h-4 w-4" /> Sécurité
                        </a>
                        <a href="#preferences"
                            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                            <SlidersHorizontal class="mr-2 h-4 w-4" /> Préférences d'affichage
                        </a>
                        <a href="#facturation"
                            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                            <CreditCard class="mr-2 h-4 w-4" />
                            Facturation et abonnement
                        </a>
                    </div>
                </div> -->

                <!-- Personal Information Section -->
                <div id="informations-personnelles" class="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-lg font-bold text-gray-800">
                            Informations personnelles
                        </h2>
                        <button @click="savePersonalInfo"
                            class="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            <Save class="mr-2 h-4 w-4" /> Enregistrer
                        </button>
                    </div>

                    <div class="flex flex-col md:flex-row gap-8">
                        <div class="md:w-1/3 flex flex-col items-center">
                            <div class="relative mb-4 cursor-pointer group" @click="openFilePicker">
                                <div
                                    class="w-40 h-40 rounded-full overflow-hidden border-4 border-pink-100 group-hover:border-pink-300 transition-colors">
                                    <img :src="userAvatar" alt="Photo de profil" class="w-full h-full object-cover" />
                                </div>
                                <div
                                    class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Camera class="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <input type="file" ref="fileInput" @change="handleFileChange"
                                accept="image/png, image/jpeg, image/webp" class="hidden" />
                            <p class="text-sm text-gray-500 text-center">
                                Format JPG, PNG. Taille maximale 5MB.<br />
                                Résolution recommandée: 300x300px
                            </p>
                        </div>

                        <div class="md:w-2/3">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label for="firstName"
                                        class="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                                    <input type="text" id="firstName" v-model="personalInfo.firstName"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Votre prénom" />
                                </div>
                                <div>
                                    <label for="lastName"
                                        class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                    <input type="text" id="lastName" v-model="personalInfo.lastName"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Votre nom" />
                                </div>
                                <div>
                                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email
                                        personnel</label>
                                    <input type="email" id="email" v-model="personalInfo.email"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="votre.email@exemple.com" />
                                </div>
                                <div>
                                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Téléphone
                                        personnel</label>
                                    <input type="tel" id="phone" v-model="personalInfo.phone"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="06 12 34 56 78" />
                                </div>
                                <div class="md:col-span-2">
                                    <label for="jobTitle" class="block text-sm font-medium text-gray-700 mb-2">Titre
                                        professionnel</label>
                                    <input type="text" id="jobTitle" v-model="personalInfo.jobTitle"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Ex: Esthéticienne, Coiffeuse, etc." />
                                </div>
                                <div class="md:col-span-2">
                                    <label for="bio"
                                        class="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
                                    <textarea id="bio" v-model="personalInfo.bio" rows="4"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Parlez de votre parcours et de votre expertise..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Professional Information Section -->
                <div id="coordonnees-professionnelles" class="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-lg font-bold text-gray-800">
                            Coordonnées professionnelles
                        </h2>
                        <button @click="saveProfessionalInfo"
                            class="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            <Save class="mr-2 h-4 w-4" /> Enregistrer
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label for="businessName" class="block text-sm font-medium text-gray-700 mb-2">Nom de
                                l'établissement</label>
                            <input type="text" id="businessName" v-model="professionalInfo.businessName"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                placeholder="Nom de votre salon ou établissement" />
                        </div>
                        <div class="md:col-span-2">
                            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                            <input type="text" id="address" v-model="professionalInfo.address"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                placeholder="Adresse complète" />
                        </div>
                        <div>
                            <label for="businessPhone" class="block text-sm font-medium text-gray-700 mb-2">Téléphone
                                professionnel</label>
                            <input type="tel" id="businessPhone" v-model="professionalInfo.businessPhone"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                placeholder="01 23 45 67 89" />
                        </div>
                        <div>
                            <label for="businessEmail" class="block text-sm font-medium text-gray-700 mb-2">Email
                                professionnel</label>
                            <input type="email" id="businessEmail" v-model="professionalInfo.businessEmail"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                placeholder="contact@votresalon.com" />
                        </div>
                        <div>
                            <label for="website" class="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                            <input type="url" id="website" v-model="professionalInfo.website"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                placeholder="https://www.votresalon.com" />
                        </div>
                        <div>
                            <label for="siret" class="block text-sm font-medium text-gray-700 mb-2">Numéro SIRET</label>
                            <input type="text" id="siret" v-model="professionalInfo.siret"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                placeholder="123 456 789 00012" />
                        </div>
                    </div>
                </div>

                <!-- Notifications Section -->
               <!--  <div id="notifications" class="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-lg font-bold text-gray-800">
                            Paramètres de notification
                        </h2>
                        <button @click="saveNotificationSettings"
                            class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            <Save class="mr-2 h-4 w-4"></Save> Enregistrer
                        </button>
                    </div>

                    <div class="space-y-6">
                        <div>
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Notifications par email
                            </h3>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-700">
                                            Nouveaux rendez-vous
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            Recevez un email lorsqu'un nouveau rendez-vous est pris
                                        </p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="notificationSettings.email.newAppointments"
                                            class="sr-only peer" />
                                        <div
                                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600">
                                        </div>
                                    </label>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-700">
                                            Rappels de rendez-vous
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            Recevez un email de rappel avant vos rendez-vous
                                        </p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="notificationSettings.email.appointmentReminders"
                                            class="sr-only peer" />
                                        <div
                                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600">
                                        </div>
                                    </label>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-700">
                                            Nouveaux avis clients
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            Recevez un email lorsqu'un client laisse un avis
                                        </p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="notificationSettings.email.newReviews"
                                            class="sr-only peer" />
                                        <div
                                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600">
                                        </div>
                                    </label>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-700">
                                            Promotions et nouveautés
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            Recevez des emails sur les nouvelles fonctionnalités et
                                            offres
                                        </p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="notificationSettings.email.promotions"
                                            class="sr-only peer" />
                                        <div
                                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600">
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="border-t pt-6">
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Notifications push
                            </h3>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-700">
                                            Nouveaux rendez-vous
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            Recevez une notification lorsqu'un nouveau rendez-vous est
                                            pris
                                        </p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="notificationSettings.push.newAppointments"
                                            class="sr-only peer" />
                                        <div
                                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600">
                                        </div>
                                    </label>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-700">
                                            Rappels de rendez-vous
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            Recevez une notification de rappel avant vos rendez-vous
                                        </p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="notificationSettings.push.appointmentReminders"
                                            class="sr-only peer" />
                                        <div
                                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600">
                                        </div>
                                    </label>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-700">
                                            Nouveaux avis clients
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            Recevez une notification lorsqu'un client laisse un avis
                                        </p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="notificationSettings.push.newReviews"
                                            class="sr-only peer" />
                                        <div
                                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600">
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="border-t pt-6">
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Résumés et rapports
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <label for="summaryFrequency"
                                        class="block text-sm font-medium text-gray-700 mb-2">Fréquence des résumés
                                        d'activité</label>
                                    <select id="summaryFrequency" v-model="notificationSettings.summaryFrequency"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm">
                                        <option value="daily">Quotidien</option>
                                        <option value="weekly">Hebdomadaire</option>
                                        <option value="monthly">Mensuel</option>
                                        <option value="never">Jamais</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Contenu des
                                        résumés</label>
                                    <div class="space-y-2">
                                        <label class="flex items-center">
                                            <input type="checkbox" v-model="notificationSettings.summaryContent.appointments
                                                " class="mr-2 rounded text-pink-600 focus:ring-pink-500" />
                                            <span class="text-sm text-gray-700">Rendez-vous</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" v-model="notificationSettings.summaryContent.reviews"
                                                class="mr-2 rounded text-pink-600 focus:ring-pink-500" />
                                            <span class="text-sm text-gray-700">Avis clients</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" v-model="notificationSettings.summaryContent.sales"
                                                class="mr-2 rounded text-pink-600 focus:ring-pink-500" />
                                            <span class="text-sm text-gray-700">Ventes</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox"
                                                v-model="notificationSettings.summaryContent.analytics"
                                                class="mr-2 rounded text-pink-600 focus:ring-pink-500" />
                                            <span class="text-sm text-gray-700">Statistiques</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->

                <!-- Security Section -->
               <!--  <div id="securite" class="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-lg font-bold text-gray-800">Sécurité</h2>
                    </div>

                    <div class="space-y-8">
                        <div>
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Modifier le mot de passe
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label for="currentPassword"
                                        class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                                    <input type="password" id="currentPassword"
                                        v-model="securitySettings.currentPassword"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Entrez votre mot de passe actuel" />
                                </div>
                                <div class="md:col-span-2 border-t pt-4"></div>
                                <div>
                                    <label for="newPassword"
                                        class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de
                                        passe</label>
                                    <input type="password" id="newPassword" v-model="securitySettings.newPassword"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Entrez votre nouveau mot de passe" />
                                </div>
                                <div>
                                    <label for="confirmPassword"
                                        class="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de
                                        passe</label>
                                    <input type="password" id="confirmPassword"
                                        v-model="securitySettings.confirmPassword"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Confirmez votre nouveau mot de passe" />
                                </div>
                                <div class="md:col-span-2">
                                    <p class="text-xs text-gray-500 mb-4">
                                        Votre mot de passe doit contenir au moins 8 caractères,
                                        incluant au moins une lettre majuscule, une lettre
                                        minuscule, un chiffre et un caractère spécial.
                                    </p>
                                    <button @click="changePassword"
                                        class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                        <KeyRound class="mr-2 h-4 w-4" /> Changer le mot de passe
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="border-t pt-6">
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Authentification à deux facteurs
                            </h3>
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <p class="text-sm text-gray-700">
                                        Statut:
                                        <span class="font-medium text-green-600">Activé</span>
                                    </p>
                                    <p class="text-xs text-gray-500">
                                        L'authentification à deux facteurs ajoute une couche de
                                        sécurité supplémentaire à votre compte
                                    </p>
                                </div>
                                <button @click="toggleTwoFactor"
                                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                    <ToggleRight class="mr-2 text-green-600" />
                                    Désactiver
                                </button>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-700 mb-2">
                                    Méthode actuelle:
                                    <span class="font-medium">SMS au +237 6 ** ** ** 97</span>
                                </p>
                                <button @click="changeTwoFactorMethod"
                                    class="text-pink-600 hover:text-pink-700 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
                                    Changer de méthode
                                </button>
                            </div>
                        </div>

                        <div class="border-t pt-6">
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Sessions actives
                            </h3>
                            <div class="space-y-4">
                                <div class="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
                                    <div>
                                        <div class="flex items-center">
                                            <Laptop class="mr-2 text-gray-500" />
                                            <div>
                                                <p class="text-sm font-medium text-gray-800">
                                                    MacBook Pro - Paris
                                                </p>
                                                <p class="text-xs text-gray-500">
                                                    Chrome • Dernière activité: aujourd'hui à 10:45
                                                </p>
                                            </div>
                                        </div>
                                        <div class="mt-1">
                                            <span
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Session actuelle
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        class="text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                                        <X />
                                    </button>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
                                    <div>
                                        <div class="flex items-center">
                                            <Smartphone class="mr-2 text-gray-500" />
                                            <div>
                                                <p class="text-sm font-medium text-gray-800">
                                                    iPhone 13 - Paris
                                                </p>
                                                <p class="text-xs text-gray-500">
                                                    Safari • Dernière activité: aujourd'hui à 09:12
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        class="text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                                        <X />
                                    </button>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
                                    <div>
                                        <div class="flex items-center">
                                            <Tablet class="mr-2 text-gray-500" />
                                            <div>
                                                <p class="text-sm font-medium text-gray-800">
                                                    iPad - Lyon
                                                </p>
                                                <p class="text-xs text-gray-500">
                                                    Safari • Dernière activité: hier à 18:30
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        class="text-gray-400 hover:text-gray-600 cursor-pointer !rounded-button whitespace-nowrap">
                                        <X class="fas fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div class="mt-4">
                                <button @click="logoutAllSessions"
                                    class="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                    <LogOut class="mr-2 h-4 w-4" /> Déconnecter toutes
                                    les autres sessions
                                </button>
                            </div>
                        </div>

                        <div class="border-t pt-6">
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Historique des connexions
                            </h3>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Appareil
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Localisation
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Adresse IP
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="(log, index) in securitySettings.loginHistory" :key="index">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ log.date }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ log.device }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ log.location }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ log.ip }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span :class="[
                                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                    log.status === 'success'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800',
                                                ]">
                                                    {{ log.status === "success" ? "Réussie" : "Échouée" }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div> -->

                <!-- Display Preferences Section -->
                <!-- <div id="preferences" class="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-lg font-bold text-gray-800">
                            Préférences d'affichage
                        </h2>
                        <button @click="saveDisplayPreferences"
                            class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            <Save class="mr-2 h-4 w-4" /> Enregistrer
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-md font-medium text-gray-800 mb-4">Apparence</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                                    <div class="grid grid-cols-3 gap-4">
                                        <div @click="displayPreferences.theme = 'light'" :class="[
                                            'border rounded-lg p-4 cursor-pointer flex flex-col items-center',
                                            displayPreferences.theme === 'light'
                                                ? 'border-pink-500 bg-pink-50'
                                                : 'border-gray-200',
                                        ]">
                                            <div
                                                class="w-12 h-12 bg-white border border-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                                <Sun class="text-yellow-400" />
                                            </div>
                                            <span class="text-sm">Clair</span>
                                        </div>
                                        <div @click="displayPreferences.theme = 'dark'" :class="[
                                            'border rounded-lg p-4 cursor-pointer flex flex-col items-center',
                                            displayPreferences.theme === 'dark'
                                                ? 'border-pink-500 bg-pink-50'
                                                : 'border-gray-200',
                                        ]">
                                            <div
                                                class="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg mb-2 flex items-center justify-center">
                                                <Moon class="text-gray-300" />
                                            </div>
                                            <span class="text-sm">Sombre</span>
                                        </div>
                                        <div @click="displayPreferences.theme = 'system'" :class="[
                                            'border rounded-lg p-4 cursor-pointer flex flex-col items-center',
                                            displayPreferences.theme === 'system'
                                                ? 'border-pink-500 bg-pink-50'
                                                : 'border-gray-200',
                                        ]">
                                            <div
                                                class="w-12 h-12 bg-gradient-to-br from-white to-gray-800 border border-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                                <MonitorPlay class="text-gray-600" />
                                            </div>
                                            <span class="text-sm">Système</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label for="accentColor"
                                        class="block text-sm font-medium text-gray-700 mb-2">Couleur d'accent</label>
                                    <div class="grid grid-cols-6 gap-2">
                                        <div v-for="color in accentColors" :key="color.value"
                                            @click="displayPreferences.accentColor = color.value" :class="[
                                                'w-8 h-8 rounded-full cursor-pointer border-2',
                                                displayPreferences.accentColor === color.value
                                                    ? 'border-gray-800'
                                                    : 'border-transparent',
                                            ]" :style="{ backgroundColor: color.hex }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Langue et région
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <label for="language"
                                        class="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                                    <select id="language" v-model="displayPreferences.language"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm">
                                        <option value="fr">Français</option>
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="de">Deutsch</option>
                                        <option value="it">Italiano</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="dateFormat" class="block text-sm font-medium text-gray-700 mb-2">Format
                                        de date</label>
                                    <select id="dateFormat" v-model="displayPreferences.dateFormat"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm">
                                        <option value="dd/mm/yyyy">JJ/MM/AAAA (31/12/2025)</option>
                                        <option value="mm/dd/yyyy">MM/JJ/AAAA (12/31/2025)</option>
                                        <option value="yyyy-mm-dd">AAAA-MM-JJ (2025-12-31)</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="timeFormat" class="block text-sm font-medium text-gray-700 mb-2">Format
                                        d'heure</label>
                                    <select id="timeFormat" v-model="displayPreferences.timeFormat"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm">
                                        <option value="24h">24 heures (14:30)</option>
                                        <option value="12h">12 heures (2:30 PM)</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="timezone" class="block text-sm font-medium text-gray-700 mb-2">Fuseau
                                        horaire</label>
                                    <select id="timezone" v-model="displayPreferences.timezone"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm">
                                        <option value="Europe/Paris">
                                            Europe/Paris (UTC+01:00)
                                        </option>
                                        <option value="Europe/London">
                                            Europe/Londres (UTC+00:00)
                                        </option>
                                        <option value="America/New_York">
                                            Amérique/New York (UTC-05:00)
                                        </option>
                                        <option value="Asia/Tokyo">Asie/Tokyo (UTC+09:00)</option>
                                        <option value="Australia/Sydney">
                                            Australie/Sydney (UTC+10:00)
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->

                <!-- Billing and Subscription Section -->
                <!-- <div id="facturation" class="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-lg font-bold text-gray-800">
                            Facturation et abonnement
                        </h2>
                    </div>

                    <div class="space-y-8">
                        <div>
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Plan actuel
                            </h3>
                            <div
                                class="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-lg p-6">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <div class="flex items-center">
                                            <span
                                                class="inline-flex items-center justify-center bg-pink-600 text-white h-8 w-8 rounded-full mr-2">
                                                <Crown class="h-4 w-4" />
                                            </span>
                                            <h4 class="text-lg font-bold text-gray-800">
                                                Plan Premium
                                            </h4>
                                        </div>
                                        <p class="text-sm text-gray-600 mt-2">
                                            Votre abonnement se renouvelle le 15 juin 2025
                                        </p>
                                        <div class="mt-4 space-y-2">
                                            <div class="flex items-center">
                                                <Check class="fas fa-check text-green-500 mr-2"></Check>
                                                <span class="text-sm text-gray-700">Nombre illimité de clients</span>
                                            </div>
                                            <div class="flex items-center">
                                                <Check class="fas fa-check text-green-500 mr-2"></Check>
                                                <span class="text-sm text-gray-700">Gestion avancée des
                                                    rendez-vous</span>
                                            </div>
                                            <div class="flex items-center">
                                                <Check class="fas fa-check text-green-500 mr-2"></Check>
                                                <span class="text-sm text-gray-700">Rapports et analyses
                                                    détaillés</span>
                                            </div>
                                            <div class="flex items-center">
                                                <Check class="fas fa-check text-green-500 mr-2"></Check>
                                                <span class="text-sm text-gray-700">Support prioritaire</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-2xl font-bold text-gray-800">
                                            39,99 €<span class="text-sm font-normal text-gray-600">/mois</span>
                                        </p>
                                        <p class="text-sm text-gray-600">Facturé annuellement</p>
                                        <div class="mt-4">
                                            <button
                                                class="bg-white hover:bg-gray-50 text-pink-600 border border-pink-300 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer !rounded-button whitespace-nowrap">
                                                Changer de plan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Méthode de paiement
                            </h3>
                            <div class="bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-between">
                                <div class="flex items-center">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                                        alt="Visa" class="h-3 mr-2" />
                                    <div>
                                        <p class="text-sm font-medium text-gray-800">
                                            Visa se terminant par 4242
                                        </p>
                                        <p class="text-xs text-gray-500">Expire le 09/2026</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        class="text-pink-600 hover:text-pink-700 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
                                        Modifier
                                    </button>
                                </div>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-between">
                                <div class="flex items-center">
                                    <img src="data:image/png;base64,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"
                                        alt="Orange Money" class="h-4 mr-2" />
                                    <div>
                                        <p class="text-sm font-medium text-gray-800">
                                            Orange Money
                                        </p>
                                        <p class="text-xs text-gray-500">Expire le 09/2026</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        class="text-pink-600 hover:text-pink-700 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
                                        Modifier
                                    </button>
                                </div>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-between">
                                <div class="flex items-center">
                                    <img src="data:image/png;base64,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"
                                        alt="MTN Mobile Money" class="h-4 mr-2" />
                                    <div>
                                        <p class="text-sm font-medium text-gray-800">
                                            MTN Mobile Money
                                        </p>
                                        <p class="text-xs text-gray-500">Expire le 09/2026</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        class="text-pink-600 hover:text-pink-700 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
                                        Modifier
                                    </button>
                                </div>
                            </div>
                            <button
                                class="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                <i class="fas fa-plus-circle mr-2"></i> Ajouter une méthode de
                                paiement
                            </button>
                        </div>

                        <div>
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Informations de facturation
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label for="billingName" class="block text-sm font-medium text-gray-700 mb-2">Nom /
                                        Raison sociale</label>
                                    <input type="text" id="billingName" v-model="billingInfo.name"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Nom ou raison sociale" />
                                </div>
                                <div>
                                    <label for="billingVatNumber"
                                        class="block text-sm font-medium text-gray-700 mb-2">Numéro de TVA
                                        (optionnel)</label>
                                    <input type="text" id="billingVatNumber" v-model="billingInfo.vatNumber"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="FR12345678901" />
                                </div>
                                <div class="md:col-span-2">
                                    <label for="billingAddress"
                                        class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                                    <input type="text" id="billingAddress" v-model="billingInfo.address"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Adresse complète" />
                                </div>
                                <div>
                                    <label for="billingCity"
                                        class="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                                    <input type="text" id="billingCity" v-model="billingInfo.city"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Ville" />
                                </div>
                                <div>
                                    <label for="billingPostalCode"
                                        class="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                                    <input type="text" id="billingPostalCode" v-model="billingInfo.postalCode"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="Code postal" />
                                </div>
                                <div>
                                    <label for="billingCountry"
                                        class="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                                    <select id="billingCountry" v-model="billingInfo.country"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm">
                                        <option value="FR">France</option>
                                        <option value="BE">Belgique</option>
                                        <option value="CH">Suisse</option>
                                        <option value="LU">Luxembourg</option>
                                        <option value="CA">Canada</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="billingEmail" class="block text-sm font-medium text-gray-700 mb-2">Email
                                        de facturation</label>
                                    <input type="email" id="billingEmail" v-model="billingInfo.email"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                                        placeholder="email@exemple.com" />
                                </div>
                                <div class="md:col-span-2">
                                    <button @click="saveBillingInfo"
                                        class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                        <Save class="mr-2 h-4 w-4" /> Enregistrer les
                                        informations de facturation
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-md font-medium text-gray-800 mb-4">
                                Historique des paiements
                            </h3>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Numéro
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Montant
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="(invoice, index) in billingInfo.invoices" :key="index">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ invoice.date }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ invoice.number }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ invoice.amount }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span :class="[
                                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                    invoice.status === 'paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800',
                                                ]">
                                                    {{
                                                        invoice.status === "paid" ? "Payée" : "En attente"
                                                    }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    class="text-pink-600 hover:text-pink-700 cursor-pointer !rounded-button whitespace-nowrap flex items-center">
                                                    <ArrowDownToLine class="mr-1 h-4 w-4" /> PDF
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div> -->
            </main>
        </div>

        <!-- Success Toast -->
        <div v-if="showToast"
            class="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-start max-w-md">
            <i class="fas fa-check-circle text-green-500 mt-0.5 mr-3"></i>
            <div>
                <p class="font-medium">Modifications enregistrées</p>
                <p class="text-sm">
                    Vos modifications ont été enregistrées avec succès.
                </p>
            </div>
            <button @click="showToast = false"
                class="ml-4 text-green-500 hover:text-green-700 cursor-pointer !rounded-button whitespace-nowrap">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { MoveLeft,ArrowBigLeft, ArrowDownToLine, Crown, MonitorPlay, Moon, Sun, LogOut, Tablet, Laptop, X, Smartphone, ToggleRight, KeyRound, Save, Camera, Bell, User, Building, Lock, SlidersHorizontal, CreditCard, Check } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const user = authStore.user;

// User avatar
const userAvatar = ref(
    user?.enterprise?.logo || "https://readdy.ai/api/search-image?query=professional%2520portrait%2520of%2520a%2520beautiful%2520young%2520French%2520woman%2520with%2520short%2520brown%2520hair%252C%2520warm%2520smile%252C%2520natural%2520makeup%252C%2520beauty%2520salon%2520owner%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=1&orientation=squarish"
);

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);

const openFilePicker = () => {
    fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        // Vous pouvez ajouter ici une validation de la taille/type du fichier
        selectedFile.value = file;
        userAvatar.value = URL.createObjectURL(file);
    }
};

// Toast notification
const showToast = ref(false);

// Personal Information
const personalInfo = ref({
    firstName: user?.name || "",
    lastName: user?.surname || "",
    email: "", // No personal email in the provided object
    phone: user?.phone_number || "",
    jobTitle: user?.enterprise?.type || "",
    bio: user?.enterprise?.description || "",
});

// Professional Information
const professionalInfo = ref({
    businessName: user?.enterprise?.name || "",
    address: [user?.enterprise?.address, user?.enterprise?.city].filter(Boolean).join(', '),
    businessPhone: user?.enterprise?.phone_number || "",
    businessEmail: user?.enterprise?.email || "",
    website: "", // Not in user object
    siret: "", // Not in user object
    openingHours: [
        { name: "Lundi", status: "closed", openTime: "", closeTime: "" },
        { name: "Mardi", status: "open", openTime: "09:00", closeTime: "19:00" },
        { name: "Mercredi", status: "open", openTime: "09:00", closeTime: "19:00" },
        { name: "Jeudi", status: "open", openTime: "09:00", closeTime: "19:00" },
        { name: "Vendredi", status: "open", openTime: "09:00", closeTime: "20:00" },
        { name: "Samedi", status: "open", openTime: "10:00", closeTime: "18:00" },
        { name: "Dimanche", status: "closed", openTime: "", closeTime: "" },
    ],
});

// Notification Settings
const notificationSettings = ref({
    email: {
        newAppointments: true,
        appointmentReminders: true,
        newReviews: true,
        promotions: false,
    },
    push: {
        newAppointments: true,
        appointmentReminders: true,
        newReviews: false,
    },
    summaryFrequency: "weekly",
    summaryContent: {
        appointments: true,
        reviews: true,
        sales: true,
        analytics: false,
    },
});

// Security Settings
const securitySettings = ref({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
    twoFactorMethod: "sms",
    loginHistory: [
        {
            date: "01/05/2025 10:45",
            device: "Chrome sur MacBook Pro",
            location: "Paris, France",
            ip: "192.168.1.1",
            status: "success",
        },
        {
            date: "01/05/2025 09:12",
            device: "Safari sur iPhone 13",
            location: "Paris, France",
            ip: "192.168.1.2",
            status: "success",
        },
        {
            date: "30/04/2025 18:30",
            device: "Safari sur iPad",
            location: "Lyon, France",
            ip: "192.168.1.3",
            status: "success",
        },
        {
            date: "29/04/2025 14:15",
            device: "Firefox sur Windows PC",
            location: "Paris, France",
            ip: "192.168.1.4",
            status: "success",
        },
        {
            date: "28/04/2025 09:45",
            device: "Chrome sur Android",
            location: "Marseille, France",
            ip: "192.168.1.5",
            status: "failed",
        },
    ],
});

// Display Preferences
const displayPreferences = ref({
    theme: "light",
    accentColor: "pink",
    language: "fr",
    dateFormat: "dd/mm/yyyy",
    timeFormat: "24h",
    timezone: "Europe/Paris",
});

// Accent Colors
const accentColors = [
    { value: "pink", hex: "#EC4899" },
    { value: "purple", hex: "#8B5CF6" },
    { value: "blue", hex: "#3B82F6" },
    { value: "green", hex: "#10B981" },
    { value: "yellow", hex: "#F59E0B" },
    { value: "red", hex: "#EF4444" },
];

// Billing Information
const billingInfo = ref({
    name: "Sophie Dubois",
    vatNumber: "",
    address: "15 rue des Fleurs",
    city: "Paris",
    postalCode: "75008",
    country: "FR",
    email: "facturation@beautezen.fr",
    invoices: [
        {
            date: "15/04/2025",
            number: "INV-2025-042",
            amount: "39,99 €",
            status: "paid",
        },
        {
            date: "15/03/2025",
            number: "INV-2025-031",
            amount: "39,99 €",
            status: "paid",
        },
        {
            date: "15/02/2025",
            number: "INV-2025-022",
            amount: "39,99 €",
            status: "paid",
        },
        {
            date: "15/01/2025",
            number: "INV-2025-011",
            amount: "39,99 €",
            status: "paid",
        },
        {
            date: "15/12/2024",
            number: "INV-2024-122",
            amount: "39,99 €",
            status: "paid",
        },
    ],
});

// Save functions
const savePersonalInfo = () => {
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const saveProfessionalInfo = () => {
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const saveNotificationSettings = () => {
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const changePassword = () => {
    if (
        securitySettings.value.newPassword !==
        securitySettings.value.confirmPassword
    ) {
        // In a real app, show error message
        return;
    }

    // Reset password fields
    securitySettings.value.currentPassword = "";
    securitySettings.value.newPassword = "";
    securitySettings.value.confirmPassword = "";

    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const toggleTwoFactor = () => {
    securitySettings.value.twoFactorEnabled =
        !securitySettings.value.twoFactorEnabled;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const changeTwoFactorMethod = () => {
    // In a real app, show a modal to select method
    securitySettings.value.twoFactorMethod =
        securitySettings.value.twoFactorMethod === "sms" ? "app" : "sms";
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const logoutAllSessions = () => {
    // In a real app, make an API call to logout all sessions
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const saveDisplayPreferences = () => {
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const saveBillingInfo = () => {
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}

/* Remove number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

/* Remove time input styling */
input[type="time"]::-webkit-calendar-picker-indicator {
    background: none;
}
</style>
