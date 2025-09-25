<template>
    <aside class="w-full md:w-64 lg:w-72 flex-shrink-0 mb-8 md:mb-0 md:mr-8">
        <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h3 class="title-font font-semibold text-lg text-gray-800 mb-6">
                Filtrer les résultats
            </h3>

            <!-- Service Type Filter -->
            <div class="mb-6 filter-section">
                <h4 class="font-medium text-gray-700 mb-3">Type de service</h4>
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="checkbox"
                            class="rounded text-slate-900 focus:ring-pink-300 border border-gray-400" />
                        <span class="ml-2 text-gray-600">Coiffure</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox"
                            class="rounded text-slate-900 focus:ring-pink-300 border border-gray-400" />
                        <span class="ml-2 text-gray-600">Maquillage</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox"
                            class="rounded text-slate-900 focus:ring-pink-300 border border-gray-400" />
                        <span class="ml-2 text-gray-600">Manucure</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox"
                            class="rounded text-slate-900 focus:ring-pink-300 border border-gray-400" />
                        <span class="ml-2 text-gray-600">Massage</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox"
                            class="rounded text-slate-900 focus:ring-pink-300 border border-gray-400" />
                        <span class="ml-2 text-gray-600">Soins du visage</span>
                    </label>
                </div>
            </div>
            <!-- Price Range Filter -->
            <div class="mb-6 filter-section">
                <h4 class="font-medium text-gray-700 mb-3">Fourchette de prix</h4>
                <input type="range" min="2000" max="50000" value="25000"
                    class="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-gold focus:outline-none focus:ring-2 focus:ring-gold [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold" />
                <div class="flex justify-between text-sm text-gray-500 mt-2">
                    <span>2 000 Fcfa</span>
                    <span>50 000 Fcfa</span>
                </div>
            </div>
            <!-- Rating Filter -->
            <div class="mb-6 filter-section">
                <h4 class="font-medium text-gray-700 mb-3">Évaluation</h4>
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="checkbox"
                            class="rounded text-slate-900 focus:ring-slate-900 border border-gray-400" />
                        <span class="ml-2 text-gray-600">
                            <div class="flex">
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                            </div>
                        </span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox"
                            class="rounded text-slate-900 focus:ring-slate-900 border border-gray-400" />
                        <span class="ml-2 text-gray-600">
                            <div class="flex">
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                            </div>
                        </span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox"
                            class="rounded text-slate-900 focus:ring-slate-900 border border-gray-400" />
                        <span class="ml-2 text-gray-600">
                            <div class="flex">
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                                <Star class="text-amber-400" />
                                <StarHalf class="text-amber-400" />
                            </div>
                        </span>
                    </label>
                </div>
            </div>

            <!-- Availability Filter -->
            <div class="filter-section">
                <h4 class="font-medium text-gray-700 mb-3">Disponibilité</h4>
                <label class="flex items-center">
                    <input type="checkbox" class="rounded text-slate-900 focus:ring-slate-900 border border-gray-400" />
                    <span class="ml-2 text-gray-600">Disponible aujourd'hui</span>
                </label>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { Star, StarHalf } from "lucide-vue-next";
</script>
