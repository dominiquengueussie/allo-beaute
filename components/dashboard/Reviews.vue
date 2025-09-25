<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
    <div class="min-h-screen bg-gray-50 flex">
        <!-- Main Content -->
        <div class="ml-64 flex-1">
            <!-- Header -->
            <header class="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-5">
                <div class="flex items-center">
                    <div class="relative">
                        <input v-model="searchQuery" type="text" placeholder="Rechercher un avis..."
                            class="pl-10 pr-4 py-2 border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
                        <Search class="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <button
                            class="text-gray-500 hover:text-pink-500 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            <Bell class="text-xl h-4 w-4" />
                            <span
                                class="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                        </button>
                    </div>
                    <div class="flex items-center space-x-3 cursor-pointer">
                        <div class="w-10 h-10 rounded-full overflow-hidden">
                            <img :src="userAvatar" alt="Avatar utilisateur" class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p class="font-medium text-sm">Dominique Ngueussie</p>
                            <p class="text-xs text-gray-500">Esthéticien</p>
                        </div>
                    </div>
                </div>
            </header>
            <!-- Reviews Content -->
            <main class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">Avis clients</h1>
                        <p class="text-gray-600">
                            Gérez et répondez aux avis laissés par vos clients
                        </p>
                    </div>
                    <button @click="exportStats"
                        class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                        <FileInput class="mr-2  h-4 w-4" />Exporter les statistiques
                    </button>
                </div>
                <!-- Statistics Overview -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-lg shadow-sm p-6 flex items-center">
                        <div class="rounded-full bg-pink-100 p-3 mr-4">
                            <Star class="text-pink-500 text-xl  h-4 w-4" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Note moyenne</p>
                            <div class="flex items-center">
                                <p class="text-2xl font-bold text-gray-800 mr-2">
                                    {{ averageRating.toFixed(1) }}
                                </p>
                                <div class="flex">
                                    <i v-for="i in 5" :key="i" :class="[
                                        'text-sm',
                                        i <= Math.round(averageRating) ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300'
                                    ]"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 flex items-center">
                        <div class="rounded-full bg-blue-100 p-3 mr-4">

                            <MessageCircleMore class=" text-blue-500 text-xl  h-4 w-4" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Total des avis</p>
                            <p class="text-2xl font-bold text-gray-800">
                                {{ reviews.length }}
                            </p>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 flex items-center">
                        <div class="rounded-full bg-green-100 p-3 mr-4">
                            <ReplyAll class="fas fa-reply text-green-500 text-xl  h-4 w-4" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Taux de réponse</p>
                            <p class="text-2xl font-bold text-gray-800">
                                {{ responseRate }}%
                            </p>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 flex items-center">
                        <div class="rounded-full bg-purple-100 p-3 mr-4">
                            <CircleCheck class="fas fa-check-circle text-purple-500 text-xl  h-4 w-4" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Avis traités</p>
                            <p class="text-2xl font-bold text-gray-800">
                                {{ processedReviewsCount }} / {{ reviews.length }}
                            </p>
                        </div>
                    </div>
                </div>
                <!-- Rating Distribution Chart -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 class="text-lg font-bold text-gray-800 mb-4">
                        Répartition des notes
                    </h2>
                    <div class="flex items-center space-x-4">
                        <div class="w-2/3">
                            <div ref="ratingChartRef" class="h-64"></div>
                        </div>
                        <div class="w-1/3">
                            <div class="space-y-3">
                                <div v-for="i in 5" :key="i" class="flex items-center">
                                    <div class="flex items-center w-16">
                                        <span class="mr-1">{{ 6 - i }}</span>
                                        <Star class=" text-yellow-400 text-sm  h-4 w-4"></Star>
                                    </div>
                                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                                        <div class="bg-pink-500 h-2 rounded-full"
                                            :style="`width: ${getRatingPercentage(6 - i)}%`"></div>
                                    </div>
                                    <span class="ml-2 text-sm text-gray-500 w-12 text-right">{{ getRatingCount(6 - i)
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Filters -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div class="flex flex-wrap gap-4">
                        <div class="relative">
                            <button @click="toggleFilterDropdown('service')"
                                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                <ConciergeBell class="mr-2 h-4 w-4"></ConciergeBell>
                                Service
                                <ChevronDown class="ml-2 text-xs h-4 w-4"></ChevronDown>
                            </button>
                            <div v-if="openDropdown === 'service'"
                                class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 z-10 w-64">
                                <div class="space-y-2">
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="serviceFilters.all" @change="toggleAllServices"
                                            class="mr-2" />
                                        <span>Tous les services</span>
                                    </label>
                                    <div class="border-t my-2"></div>
                                    <label v-for="service in services" :key="service.id"
                                        class="flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="serviceFilters[service.id]" class="mr-2" />
                                        <span>{{ service.name }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="relative">
                            <button @click="toggleFilterDropdown('rating')"
                                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                <Star class="mr-2 h-4 w-4"></Star>
                                Note
                                <i class="fas fa-chevron-down ml-2 text-xs"></i>
                            </button>
                            <div v-if="openDropdown === 'rating'"
                                class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 z-10 w-48">
                                <div class="space-y-2">
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="ratingFilters.all" @change="toggleAllRatings"
                                            class="mr-2" />
                                        <span>Toutes les notes</span>
                                    </label>
                                    <div class="border-t my-2"></div>
                                    <label v-for="i in 5" :key="i" class="flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="ratingFilters[i]" class="mr-2" />
                                        <span class="flex items-center">
                                            {{ i }}
                                            <i class="fas fa-star text-yellow-400 text-sm ml-1"></i>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="relative">
                            <button @click="toggleFilterDropdown('date')"
                                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                <CalendarDays class="mr-2  h-4 w-4"></CalendarDays>
                                Date
                                <i class="fas fa-chevron-down ml-2 text-xs"></i>
                            </button>
                            <div v-if="openDropdown === 'date'"
                                class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 z-10 w-48">
                                <div class="space-y-2">
                                    <label class="flex items-center cursor-pointer">
                                        <input type="radio" v-model="dateFilter" value="all" class="mr-2" />
                                        <span>Toutes les dates</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="radio" v-model="dateFilter" value="lastWeek" class="mr-2" />
                                        <span>7 derniers jours</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="radio" v-model="dateFilter" value="lastMonth" class="mr-2" />
                                        <span>30 derniers jours</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="radio" v-model="dateFilter" value="last3Months" class="mr-2" />
                                        <span>3 derniers mois</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="radio" v-model="dateFilter" value="lastYear" class="mr-2" />
                                        <span>12 derniers mois</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="relative">
                            <button @click="toggleFilterDropdown('status')"
                                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                <ArrowDownWideNarrow class="mr-2 h-4 w-4" /> Statut
                                <i class="fas fa-chevron-down ml-2 text-xs"></i>
                            </button>
                            <div v-if="openDropdown === 'status'"
                                class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 z-10 w-48">
                                <div class="space-y-2">
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="statusFilters.all" @change="toggleAllStatuses"
                                            class="mr-2" />
                                        <span>Tous les statuts</span>
                                    </label>
                                    <div class="border-t my-2"></div>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="statusFilters.processed" class="mr-2" />
                                        <span>Traités</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="statusFilters.unprocessed" class="mr-2" />
                                        <span>Non traités</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="statusFilters.withResponse" class="mr-2" />
                                        <span>Avec réponse</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="statusFilters.withoutResponse" class="mr-2" />
                                        <span>Sans réponse</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="ml-auto">
                            <button @click="resetFilters"
                                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                                <RotateCcw class="mr-2 h-4 w-4" /> Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Reviews List -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                    <div v-if="filteredReviews.length === 0" class="py-12 text-center">
                        <div class="mb-4 text-gray-400">
                            <i class="fas fa-comment-slash text-5xl"></i>
                        </div>
                        <h3 class="text-xl font-medium text-gray-800 mb-2">
                            Aucun avis trouvé
                        </h3>
                        <p class="text-gray-600 mb-6">
                            Aucun avis ne correspond à vos critères de recherche.
                        </p>
                        <button @click="resetFilters"
                            class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            Réinitialiser les filtres
                        </button>
                    </div>
                    <div v-else class="divide-y divide-gray-200">
                        <div v-for="review in paginatedReviews" :key="review.id"
                            class="p-6 hover:bg-gray-50 transition-colors duration-200">
                            <div class="flex flex-col md:flex-row">
                                <div class="md:w-1/4 mb-4 md:mb-0">
                                    <div class="flex items-start">
                                        <div class="h-12 w-12 rounded-full overflow-hidden mr-3">
                                            <img :src="review.clientAvatar" alt="Client"
                                                class="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 class="font-medium text-gray-900">
                                                {{ review.clientName }}
                                            </h3>
                                            <p class="text-sm text-gray-500">
                                                {{ formatDate(review.date) }}
                                            </p>
                                            <div class="flex items-center mt-1">
                                                <div class="flex">
                                                    <span class="flex items-center">
                                                        <component v-for="i in 5" :key="i"
                                                            :is="i <= review.rating ? Star : StarOff"
                                                            class="w-4 h-4 mr-0.5"
                                                            :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-3">
                                        <span
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                            {{ getServiceName(review.serviceId) }}
                                        </span>
                                        <span :class="[
                                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2',
                                            review.isProcessed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        ]">
                                            {{ review.isProcessed ? 'Traité' : 'Non traité' }}
                                        </span>
                                    </div>
                                </div>
                                <div class="md:w-3/4 md:pl-6">
                                    <div class="mb-4">
                                        <p class="text-gray-700">{{ review.comment }}</p>
                                    </div>
                                    <div v-if="review.response" class="bg-gray-50 p-4 rounded-lg mb-4">
                                        <div class="flex items-start">
                                            <div class="h-8 w-8 rounded-full overflow-hidden mr-3">
                                                <img :src="userAvatar" alt="Propriétaire"
                                                    class="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 class="font-medium text-gray-900">Votre réponse</h4>
                                                <p class="text-sm text-gray-500">
                                                    {{ formatDate(review.responseDate) }}
                                                </p>
                                            </div>
                                        </div>
                                        <p class="text-gray-700 mt-2">{{ review.response }}</p>
                                    </div>
                                    <div class="flex justify-end space-x-3">
                                        <button v-if="!review.response" @click="openResponseModal(review)"
                                            class="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                            <Reply class="mr-1.5 h-4 w-4" /> Répondre
                                        </button>
                                        <button v-else @click="openResponseModal(review)"
                                            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                                            <Pencil class="mr-1.5 h-4 w-4" />Modifier
                                        </button>
                                        <button @click="toggleProcessed(review)" :class="[
                                            'px-3 py-1.5 rounded text-sm flex items-center transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap',
                                            review.isProcessed
                                                ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                                                : 'bg-green-100 hover:bg-green-200 text-green-700'
                                        ]">
                                            <component :is="review.isProcessed ? X : Check"
                                                class="w-4 h-4 mr-1.5 text-gray-600" />
                                            {{ review.isProcessed ? 'Marquer non traité' : 'Marquer traité' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Pagination -->
                    <div v-if="filteredReviews.length > 0"
                        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p class="text-sm text-gray-700">
                                    Affichage de
                                    <span class="font-medium">{{ paginationStart }}</span> à
                                    <span class="font-medium">{{ paginationEnd }}</span> sur
                                    <span class="font-medium">{{ filteredReviews.length }}</span>
                                    avis
                                </p>
                            </div>
                            <div>
                                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                    aria-label="Pagination">
                                    <button @click="currentPage > 1 ? currentPage-- : null"
                                        :disabled="currentPage === 1" :class="[
                                            'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                                            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                                        ]">
                                        <span class="sr-only">Précédent</span>
                                        <ChevronLeft></ChevronLeft>
                                    </button>
                                    <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                        currentPage === page
                                            ? 'z-10 bg-pink-50 border-pink-500 text-pink-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    ]">
                                        {{ page }}
                                    </button>
                                    <button @click="currentPage < totalPages ? currentPage++ : null"
                                        :disabled="currentPage === totalPages" :class="[
                                            'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                                            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                                        ]">
                                        <span class="sr-only">Suivant</span>
                                        <ChevronRight></ChevronRight>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        <!-- Response Modal -->
        <div v-if="showResponseModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl" @click.stop>
                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold text-gray-800">Répondre à l'avis</h2>
                </div>
                <div class="p-6">
                    <div class="mb-6 bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-start mb-3">
                            <div class="h-10 w-10 rounded-full overflow-hidden mr-3">
                                <img :src="selectedReview.clientAvatar" alt="Client"
                                    class="h-full w-full object-cover" />
                            </div>
                            <div>
                                <h3 class="font-medium text-gray-900">
                                    {{ selectedReview.clientName }}
                                </h3>
                                <p class="text-sm text-gray-500">
                                    {{ formatDate(selectedReview.date) }}
                                </p>
                                <div class="flex items-center mt-1">
                                    <div class="flex">
                                        <span v-for="i in 5" :key="i">
                                            <component :is="i <= selectedReview.rating ? Star : StarOff"
                                                class="w-4 h-4 mr-0.5"
                                                :class="i <= selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="text-gray-700">{{ selectedReview.comment }}</p>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Votre réponse</label>
                        <textarea v-model="responseText" rows="5"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                            placeholder="Écrivez votre réponse ici..."></textarea>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="closeResponseModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            Annuler
                        </button>
                        <button type="button" @click="submitResponse"
                            class="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            {{ selectedReview.response ? 'Mettre à jour' : 'Envoyer la réponse' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Export Stats Modal -->
        <div v-if="showExportModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md" @click.stop>
                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold text-gray-800">
                        Exporter les statistiques
                    </h2>
                </div>
                <div class="p-6">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Format d'export</label>
                        <div class="space-y-2">
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" v-model="exportFormat" value="pdf" class="mr-2" />
                                <span>PDF</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" v-model="exportFormat" value="csv" class="mr-2" />
                                <span>CSV</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" v-model="exportFormat" value="excel" class="mr-2" />
                                <span>Excel</span>
                            </label>
                        </div>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
                        <div class="space-y-2">
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" v-model="exportPeriod" value="all" class="mr-2" />
                                <span>Toutes les données</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" v-model="exportPeriod" value="lastMonth" class="mr-2" />
                                <span>30 derniers jours</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" v-model="exportPeriod" value="lastYear" class="mr-2" />
                                <span>12 derniers mois</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" v-model="exportPeriod" value="custom" class="mr-2" />
                                <span>Période personnalisée</span>
                            </label>
                        </div>
                    </div>
                    <div v-if="exportPeriod === 'custom'" class="mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                            <input v-model="exportStartDate" type="date"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                            <input v-model="exportEndDate" type="date"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm" />
                        </div>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="closeExportModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            Annuler
                        </button>
                        <button type="button" @click="downloadExport"
                            class="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap">
                            Télécharger
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script lang="ts" setup>
import { Star, Search, Check, X, StarOff, Pencil, Reply, CircleCheck, RotateCcw, ArrowDownWideNarrow, Bell, ReplyAll, FileInput, MessageCircleMore, ChevronDown, ChevronLeft, ConciergeBell, CalendarDays, ChevronRight } from "lucide-vue-next";
import * as echarts from "echarts";
// User avatar
const userAvatar =
    "https://readdy.ai/api/search-image?query=professional%2520portrait%2520of%2520a%2520beautiful%2520young%2520French%2520woman%2520with%2520short%2520brown%2520hair%252C%2520warm%2520smile%252C%2520natural%2520makeup%252C%2520beauty%2520salon%2520owner%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=1&orientation=squarish";
// State variables
const searchQuery = ref("");
const openDropdown = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(5);
const showResponseModal = ref(false);
const showExportModal = ref(false);
const responseText = ref("");
const dateFilter = ref("all");
const ratingChartRef = ref<HTMLElement | null>(null);
const ratingChart = ref<echarts.ECharts | null>(null);
// Export options
const exportFormat = ref("pdf");
const exportPeriod = ref("all");
const exportStartDate = ref("");
const exportEndDate = ref("");
// Selected review for response
const selectedReview = ref({
    id: 0,
    clientId: 0,
    clientName: "",
    clientAvatar: "",
    serviceId: 0,
    rating: 0,
    comment: "",
    date: new Date(),
    response: "",
    responseDate: null as Date | null,
    isProcessed: false,
});
// Status filters
const statusFilters = ref({
    all: true,
    processed: true,
    unprocessed: true,
    withResponse: true,
    withoutResponse: true,
});
// Rating filters
const ratingFilters = ref({
    all: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
});
// Service filters
const serviceFilters = ref({
    all: true,
});
// Services data
const services = ref([
    { id: 1, name: "Soin du visage" },
    { id: 2, name: "Massage relaxant" },
    { id: 3, name: "Manucure" },
    { id: 4, name: "Épilation jambes complètes" },
    { id: 5, name: "Coupe et brushing" },
]);
// Initialize service filters
services.value.forEach((service) => {
    serviceFilters.value[service.id] = true;
});
// Reviews data
const reviews = ref([
    {
        id: 1,
        clientId: 1,
        clientName: "Marie Dupont",
        clientAvatar:
            "https://readdy.ai/api/search-image?query=portrait%2520of%2520a%2520beautiful%2520young%2520French%2520woman%2520with%2520long%2520brown%2520hair%252C%2520warm%2520smile%252C%2520natural%2520makeup%252C%2520beauty%2520client%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=201&orientation=squarish",
        serviceId: 1,
        rating: 5,
        comment:
            "J'ai adoré mon soin du visage ! Ma peau est rayonnante et le personnel était très professionnel. L'ambiance était relaxante et j'ai vraiment apprécié les produits utilisés. Je reviendrai sans hésiter !",
        date: new Date("2025-04-25"),
        response:
            "Merci beaucoup pour votre retour, Marie ! Nous sommes ravis que vous ayez apprécié votre soin du visage. Nous utilisons uniquement des produits de qualité et nous nous efforçons de créer une ambiance relaxante. Au plaisir de vous revoir bientôt !",
        responseDate: new Date("2025-04-26"),
        isProcessed: true,
    },
    {
        id: 2,
        clientId: 2,
        clientName: "Julien Martin",
        clientAvatar:
            "https://readdy.ai/api/search-image?query=portrait%2520of%2520a%2520handsome%2520young%2520French%2520man%2520with%2520short%2520dark%2520hair%252C%2520friendly%2520smile%252C%2520natural%2520look%252C%2520beauty%2520client%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=202&orientation=squarish",
        serviceId: 2,
        rating: 4,
        comment:
            "Très bon massage relaxant qui m'a permis de dénouer mes tensions. Le thérapeute était attentif à mes besoins. J'aurais aimé que la séance dure un peu plus longtemps, mais dans l'ensemble c'était une excellente expérience.",
        date: new Date("2025-04-28"),
        response: "",
        responseDate: null,
        isProcessed: false,
    },
    {
        id: 3,
        clientId: 3,
        clientName: "Sophie Leroy",
        clientAvatar:
            "https://readdy.ai/api/search-image?query=portrait%2520of%2520a%2520beautiful%2520middle-aged%2520French%2520woman%2520with%2520blonde%2520hair%252C%2520elegant%2520smile%252C%2520natural%2520makeup%252C%2520beauty%2520client%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=203&orientation=squarish",
        serviceId: 3,
        rating: 5,
        comment:
            "Manucure parfaite ! Les couleurs sont magnifiques et tiennent vraiment bien. L'esthéticienne a été très minutieuse et a pris le temps de s'occuper de mes cuticules. Le salon est très propre et l'accueil chaleureux.",
        date: new Date("2025-04-20"),
        response:
            "Merci Sophie pour votre gentil commentaire ! Nous sommes heureux que vous ayez apprécié votre manucure. Nous accordons une grande importance à la qualité de nos services et à la propreté de notre salon. À très bientôt !",
        responseDate: new Date("2025-04-21"),
        isProcessed: true,
    },
    {
        id: 4,
        clientId: 4,
        clientName: "Thomas Petit",
        clientAvatar:
            "https://readdy.ai/api/search-image?query=portrait%2520of%2520a%2520handsome%2520middle-aged%2520French%2520man%2520with%2520salt%2520and%2520pepper%2520hair%252C%2520confident%2520smile%252C%2520natural%2520look%252C%2520beauty%2520client%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=204&orientation=squarish",
        serviceId: 5,
        rating: 3,
        comment:
            "La coupe est correcte mais pas exactement ce que j'avais demandé. Le coiffeur était sympathique mais un peu pressé. L'ambiance du salon est agréable et les produits utilisés sentent bon.",
        date: new Date("2025-04-29"),
        response:
            "Bonjour Thomas, nous vous remercions pour votre retour. Nous sommes désolés que la coupe ne corresponde pas exactement à vos attentes. Nous aimerions vous offrir une retouche gratuite lors de votre prochaine visite. N'hésitez pas à nous contacter pour prendre rendez-vous.",
        responseDate: new Date("2025-04-30"),
        isProcessed: true,
    },
    {
        id: 5,
        clientId: 5,
        clientName: "Camille Dubois",
        clientAvatar:
            "https://readdy.ai/api/search-image?query=portrait%2520of%2520a%2520beautiful%2520young%2520French%2520woman%2520with%2520short%2520blonde%2520hair%252C%2520bright%2520smile%252C%2520natural%2520makeup%252C%2520beauty%2520client%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=205&orientation=squarish",
        serviceId: 4,
        rating: 5,
        comment:
            "Service d'épilation parfait ! Rapide, efficace et presque indolore. L'esthéticienne était très professionnelle et m'a mise à l'aise. Le résultat est impeccable et le prix raisonnable.",
        date: new Date("2025-04-26"),
        response: "",
        responseDate: null,
        isProcessed: false,
    },
    {
        id: 6,
        clientId: 6,
        clientName: "Émilie Bernard",
        clientAvatar:
            "https://readdy.ai/api/search-image?query=portrait%2520of%2520a%2520beautiful%2520young%2520French%2520woman%2520with%2520curly%2520brown%2520hair%252C%2520natural%2520smile%252C%2520minimal%2520makeup%252C%2520beauty%2520client%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=206&orientation=squarish",
        serviceId: 1,
        rating: 4,
        comment:
            "Très bon soin du visage, ma peau est douce et hydratée. L'esthéticienne a bien analysé mes besoins et m'a donné de bons conseils. Le seul bémol était la température de la pièce, un peu fraîche à mon goût.",
        date: new Date("2025-05-01"),
        response: "",
        responseDate: null,
        isProcessed: false,
    },
    {
        id: 7,
        clientId: 7,
        clientName: "Alexandre Moreau",
        clientAvatar:
            "https://readdy.ai/api/search-image?query=portrait%2520of%2520a%2520handsome%2520young%2520French%2520man%2520with%2520medium%2520length%2520brown%2520hair%252C%2520gentle%2520smile%252C%2520natural%2520look%252C%2520beauty%2520client%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=207&orientation=squarish",
        serviceId: 2,
        rating: 5,
        comment:
            "Excellent massage relaxant ! Le thérapeute a trouvé tous mes points de tension et a su adapter la pression selon mes besoins. L'huile essentielle utilisée était parfaite et l'ambiance très zen. Je me sens complètement détendu.",
        date: new Date("2025-04-15"),
        response:
            "Merci Alexandre pour ce merveilleux commentaire ! Nous sommes ravis que vous ayez apprécié votre massage. Notre thérapeute est en effet très attentif aux besoins spécifiques de chaque client. Nous espérons vous revoir bientôt pour un autre moment de détente !",
        responseDate: new Date("2025-04-16"),
        isProcessed: true,
    },
    {
        id: 8,
        clientId: 8,
        clientName: "Léa Fournier",
        clientAvatar:
            "https://readdy.ai/api/search-image?query=portrait%2520of%2520a%2520beautiful%2520middle-aged%2520French%2520woman%2520with%2520shoulder%2520length%2520auburn%2520hair%252C%2520warm%2520smile%252C%2520natural%2520makeup%252C%2520beauty%2520client%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=208&orientation=squarish",
        serviceId: 5,
        rating: 2,
        comment:
            "Déçue de ma coupe. J'avais montré une photo mais le résultat est très différent. De plus, j'ai dû attendre 20 minutes alors que j'avais rendez-vous. Le personnel était néanmoins aimable et s'est excusé pour l'attente.",
        date: new Date("2025-04-10"),
        response:
            "Chère Léa, nous sommes sincèrement désolés que votre expérience n'ait pas été à la hauteur de vos attentes. Nous aimerions vous proposer une nouvelle coupe gratuite pour rectifier cela. Notre directrice artistique se fera un plaisir de s'occuper personnellement de vous. Nous nous excusons également pour l'attente et travaillons à améliorer notre ponctualité.",
        responseDate: new Date("2025-04-11"),
        isProcessed: true,
    },
    {
        id: 9,
        clientId: 9,
        clientName: "Nicolas Lambert",
        clientAvatar:
            "https://readdy.ai/api/search-image?query=portrait%2520of%2520a%2520handsome%2520middle-aged%2520French%2520man%2520with%2520short%2520gray%2520hair%252C%2520professional%2520look%252C%2520subtle%2520smile%252C%2520beauty%2520client%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=209&orientation=squarish",
        serviceId: 1,
        rating: 5,
        comment:
            "Soin du visage exceptionnel ! Ma peau n'a jamais été aussi belle. L'esthéticienne a pris le temps de m'expliquer chaque étape et de me conseiller sur ma routine quotidienne. Le massage facial était divin. Je recommande vivement !",
        date: new Date("2025-03-20"),
        response:
            "Merci beaucoup pour votre avis enthousiaste, Nicolas ! Nous sommes ravis que vous ayez apprécié notre soin du visage. Notre équipe est formée pour offrir des conseils personnalisés adaptés à chaque type de peau. Au plaisir de vous accueillir à nouveau !",
        responseDate: new Date("2025-03-21"),
        isProcessed: true,
    },
    {
        id: 10,
        clientId: 10,
        clientName: "Chloé Mercier",
        clientAvatar:
            "https://readdy.ai/api/search-image?query=portrait%2520of%2520a%2520beautiful%2520young%2520French%2520woman%2520with%2520long%2520black%2520hair%252C%2520bright%2520smile%252C%2520natural%2520makeup%252C%2520beauty%2520client%252C%2520professional%2520headshot%252C%2520neutral%2520background%252C%2520high%2520quality%252C%2520photorealistic&width=200&height=200&seq=210&orientation=squarish",
        serviceId: 3,
        rating: 4,
        comment:
            "Très belle manucure, les ongles sont parfaits et la couleur magnifique. L'esthéticienne était minutieuse et créative. Le salon est joli mais un peu bruyant ce jour-là. Dans l'ensemble, une bonne expérience.",
        date: new Date("2025-04-05"),
        response: "",
        responseDate: null,
        isProcessed: true,
    },
]);
// Close dropdowns when clicking outside
const closeDropdowns = (event: MouseEvent) => {
    if (openDropdown.value !== "") {
        openDropdown.value = "";
    }
};
onMounted(() => {
    document.addEventListener("click", closeDropdowns);
    initRatingChart();
});
onBeforeUnmount(() => {
    document.removeEventListener("click", closeDropdowns);
    if (ratingChart.value) {
        ratingChart.value.dispose();
    }
});
// Toggle filter dropdowns
const toggleFilterDropdown = (dropdown: string) => {
    openDropdown.value = openDropdown.value === dropdown ? "" : dropdown;
};
// Toggle all statuses
const toggleAllStatuses = () => {
    const allChecked = statusFilters.value.all;
    statusFilters.value.processed = allChecked;
    statusFilters.value.unprocessed = allChecked;
    statusFilters.value.withResponse = allChecked;
    statusFilters.value.withoutResponse = allChecked;
};
// Toggle all ratings
const toggleAllRatings = () => {
    const allChecked = ratingFilters.value.all;
    for (let i = 1; i <= 5; i++) {
        ratingFilters.value[i] = allChecked;
    }
};
// Toggle all services
const toggleAllServices = () => {
    const allChecked = serviceFilters.value.all;
    services.value.forEach((service) => {
        serviceFilters.value[service.id] = allChecked;
    });
};
// Format date
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
};
// Get service name by ID
const getServiceName = (serviceId: number) => {
    const service = services.value.find((s) => s.id === serviceId);
    return service ? service.name : "";
};
// Toggle processed status
const toggleProcessed = (review: any) => {
    const index = reviews.value.findIndex((r) => r.id === review.id);
    if (index !== -1) {
        reviews.value[index].isProcessed = !reviews.value[index].isProcessed;
    }
};
// Open response modal
const openResponseModal = (review: any) => {
    selectedReview.value = { ...review };
    responseText.value = review.response || "";
    showResponseModal.value = true;
};
// Close response modal
const closeResponseModal = () => {
    showResponseModal.value = false;
};
// Submit response
const submitResponse = () => {
    const index = reviews.value.findIndex(
        (r) => r.id === selectedReview.value.id,
    );
    if (index !== -1) {
        reviews.value[index].response = responseText.value;
        reviews.value[index].responseDate = new Date();
        if (!reviews.value[index].isProcessed) {
            reviews.value[index].isProcessed = true;
        }
    }
    closeResponseModal();
};
// Export stats
const exportStats = () => {
    showExportModal.value = true;
};
// Close export modal
const closeExportModal = () => {
    showExportModal.value = false;
};
// Download export
const downloadExport = () => {
    // In a real app, this would generate and download the export file
    // For now, we'll just close the modal
    closeExportModal();
};
// Reset filters
const resetFilters = () => {
    searchQuery.value = "";
    dateFilter.value = "all";
    statusFilters.value = {
        all: true,
        processed: true,
        unprocessed: true,
        withResponse: true,
        withoutResponse: true,
    };
    ratingFilters.value = {
        all: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
    };
    serviceFilters.value = { all: true };
    services.value.forEach((service) => {
        serviceFilters.value[service.id] = true;
    });
};
// Initialize rating chart
const initRatingChart = () => {
    nextTick(() => {
        if (ratingChartRef.value) {
            ratingChart.value = echarts.init(ratingChartRef.value);
            const option = {
                animation: false,
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                    },
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: "category",
                        data: ["1★", "2★", "3★", "4★", "5★"],
                        axisTick: {
                            alignWithLabel: true,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                    },
                ],
                series: [
                    {
                        name: "Nombre d'avis",
                        type: "bar",
                        barWidth: "60%",
                        data: [
                            { value: getRatingCount(1), itemStyle: { color: "#FCA5A5" } },
                            { value: getRatingCount(2), itemStyle: { color: "#FBBF24" } },
                            { value: getRatingCount(3), itemStyle: { color: "#93C5FD" } },
                            { value: getRatingCount(4), itemStyle: { color: "#6EE7B7" } },
                            { value: getRatingCount(5), itemStyle: { color: "#F472B6" } },
                        ],
                    },
                ],
            };
            ratingChart.value.setOption(option);
            window.addEventListener("resize", () => {
                if (ratingChart.value) {
                    ratingChart.value.resize();
                }
            });
        }
    });
};
// Get rating count
const getRatingCount = (rating: number) => {
    return reviews.value.filter((review) => review.rating === rating).length;
};
// Get rating percentage
const getRatingPercentage = (rating: number) => {
    const count = getRatingCount(rating);
    return reviews.value.length > 0 ? (count / reviews.value.length) * 100 : 0;
};
// Filter reviews based on search, date, status, rating, and service
const filteredReviews = computed(() => {
    let result = [...reviews.value];
    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(
            (review) =>
                review.clientName.toLowerCase().includes(query) ||
                review.comment.toLowerCase().includes(query) ||
                getServiceName(review.serviceId).toLowerCase().includes(query),
        );
    }
    // Filter by date
    if (dateFilter.value !== "all") {
        const now = new Date();
        let cutoffDate = new Date();
        switch (dateFilter.value) {
            case "lastWeek":
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case "lastMonth":
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case "last3Months":
                cutoffDate.setMonth(now.getMonth() - 3);
                break;
            case "lastYear":
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
        }
        result = result.filter((review) => review.date >= cutoffDate);
    }
    // Filter by status
    if (!statusFilters.value.all) {
        const statusConditions = [];
        if (statusFilters.value.processed) {
            statusConditions.push((review: any) => review.isProcessed);
        }
        if (statusFilters.value.unprocessed) {
            statusConditions.push((review: any) => !review.isProcessed);
        }
        if (statusFilters.value.withResponse) {
            statusConditions.push((review: any) => review.response);
        }
        if (statusFilters.value.withoutResponse) {
            statusConditions.push((review: any) => !review.response);
        }
        if (statusConditions.length > 0) {
            result = result.filter((review) =>
                statusConditions.some((condition) => condition(review)),
            );
        }
    }
    // Filter by rating
    if (!ratingFilters.value.all) {
        const activeRatings = [];
        for (let i = 1; i <= 5; i++) {
            if (ratingFilters.value[i]) {
                activeRatings.push(i);
            }
        }
        if (activeRatings.length > 0) {
            result = result.filter((review) => activeRatings.includes(review.rating));
        }
    }
    // Filter by service
    if (!serviceFilters.value.all) {
        const activeServiceIds = services.value
            .filter((service) => serviceFilters.value[service.id])
            .map((service) => service.id);
        if (activeServiceIds.length > 0) {
            result = result.filter((review) =>
                activeServiceIds.includes(review.serviceId),
            );
        }
    }
    // Sort by date (most recent first)
    result.sort((a, b) => b.date.getTime() - a.date.getTime());
    return result;
});
// Pagination
const paginatedReviews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredReviews.value.slice(start, end);
});
const totalPages = computed(() => {
    return Math.ceil(filteredReviews.value.length / itemsPerPage.value);
});
const paginationStart = computed(() => {
    return filteredReviews.value.length > 0
        ? (currentPage.value - 1) * itemsPerPage.value + 1
        : 0;
});
const paginationEnd = computed(() => {
    const end = currentPage.value * itemsPerPage.value;
    return end > filteredReviews.value.length
        ? filteredReviews.value.length
        : end;
});
// Calculate average rating
const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0;
    const sum = reviews.value.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.value.length;
});
// Calculate response rate
const responseRate = computed(() => {
    const reviewsWithResponse = reviews.value.filter(
        (review) => review.response,
    ).length;
    return reviews.value.length > 0
        ? Math.round((reviewsWithResponse / reviews.value.length) * 100)
        : 0;
});
// Calculate processed reviews count
const processedReviewsCount = computed(() => {
    return reviews.value.filter((review) => review.isProcessed).length;
});
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
</style>