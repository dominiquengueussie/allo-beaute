<script setup>
import {MoveRight} from "lucide-vue-next";
defineEmits(['click']);
</script>


<template>
    <div class="mt-8 text-center">
        <button @click="$emit('click')"
            class="bg-gold hover:bg-yellow-golden text-slate-900 font-medium py-3 px-6 rounded-full inline-flex items-center transition-colors">
           Voir plus de services
           <MoveRight class="ml-2 text-slate-900"/>
        </button>
    </div>
</template>