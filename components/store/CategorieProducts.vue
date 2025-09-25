<template>
  <Transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0" leave-active-class="transition-transform duration-300 ease-in"
    leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
    <div v-if="isOpen"
      class="fixed top-0 left-0 h-screen w-80 p-6 shadow-2xl z-50 overflow-y-auto transition-colors duration-300"
      :class="isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'" data-simplebar>
      <!-- Bouton fermer -->
      <button @click="onClose" class="absolute top-4 right-4 text-2xl font-bold hover:text-pink-500 transition"
        title="Fermer">
        ✕
      </button>

      <!-- Titre -->
      <div class="font-bold text-2xl mb-8 mt-8">Catégories produits</div>

      <!-- Liste des catégories principales -->
      <div class="space-y-6">
        <div v-for="(category, index) in notifications" :key="category.id" class="border-b pb-4 last:border-0">
          <div @click="toggleCategory(index)"
            class="flex items-center justify-between cursor-pointer hover:text-pink-500 font-semibold transition">
            <div class="flex items-center gap-3">
              <!-- Icône catégorie -->
              <component :is="category.icon" class="w-6 h-6 text-pink-400" />
              <span>{{ category.title }}</span>
            </div>

            <!-- Chevron animé -->
            <svg
              :class="['w-5 h-5 transform transition-transform duration-300', { 'rotate-180': openCategory === index }]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Sous-catégories -->
          <Transition name="fade-slide">
            <div v-show="openCategory === index" class="pl-8 mt-3 space-y-2">
              <div v-for="subItem in category.subcategories" :key="subItem.id">
                <div v-if="subItem.children && subItem.children.length > 0">
                  <!-- Sous-catégorie avec enfants -->
                  <div @click="toggleSubcategory(subItem.id)"
                    class="flex items-center justify-between cursor-pointer hover:text-pink-400">
                    <span>{{ subItem.name }}</span>
                    <svg
                      :class="['w-4 h-4 transform transition-transform duration-300', { 'rotate-180': openSubcategory === subItem.id }]"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <!-- Sous-sous-catégories -->
                  <Transition name="fade-slide">
                    <div v-show="openSubcategory === subItem.id" class="pl-6 mt-2 space-y-1">
                      <p v-for="child in subItem.children" :key="child.id" @click.stop="openModal(child.id)"
                        class="flex items-center gap-2 py-1 px-3 rounded hover:bg-pink-100 hover:text-pink-700 cursor-pointer transition text-sm">
                        <span class="inline-block w-2 h-2 rounded-full" :class="badgeColor(child.badgeColor)"></span>
                        {{ child.name }}
                      </p>
                    </div>
                  </Transition>
                </div>

                <!-- Simple sous-catégorie sans enfants -->
                <p v-else @click.stop="openModal(subItem.id)"
                  class="flex items-center gap-2 py-1 px-3 rounded hover:bg-pink-100 hover:text-pink-700 cursor-pointer transition">
                  <span class="inline-block w-2 h-2 rounded-full" :class="badgeColor(subItem.badgeColor)"></span>
                  {{ subItem.name }}
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Modal -->
      <dialog id="my_modal_3" class="modal">
        <div class="modal-box bg-slate-100 dark:bg-gray-800 dark:text-white">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 class="text-lg font-bold">{{ selectedNotification.title }}</h3>
          <p class="py-4">{{ selectedNotification.message }}</p>
          <p>Date: {{ formatDate(selectedNotification.date) }}</p>
        </div>
      </dialog>
    </div>
  </Transition>
</template>

<script setup>

const notifications = [
  {
    id: 1,
    title: 'Maquillage',
    icon: 'RiBrushLine',
    subcategories: [
      {
        id: 11,
        name: 'Rouges à lèvres',
        badgeColor: 'red',
        children: [
          { id: 111, name: 'Mat', badgeColor: 'pink' },
          { id: 112, name: 'Brillant', badgeColor: 'yellow' },
        ],
      },
      { id: 12, name: 'Fond de teint', badgeColor: 'blue' },
      { id: 13, name: 'Mascara', badgeColor: 'purple' },
    ],
  },
  {
    id: 2,
    title: 'Soins de la peau',
    icon: 'RiDropLine',
    subcategories: [
      { id: 21, name: 'Crèmes hydratantes', badgeColor: 'green' },
      { id: 22, name: 'Sérums visage', badgeColor: 'purple' },
      { id: 23, name: 'Nettoyants', badgeColor: 'blue' },
    ],
  },
  {
    id: 3,
    title: 'Cheveux',
    icon: 'RiScissorsLine',
    subcategories: [
      { id: 31, name: 'Shampoings', badgeColor: 'yellow' },
      { id: 32, name: 'Après-shampoings', badgeColor: 'pink' },
      { id: 33, name: 'Colorations', badgeColor: 'red' },
    ],
  },
  {
    id: 4,
    title: 'Parfums',
    icon: 'RiHeartLine',
    subcategories: [
      { id: 41, name: 'Eau de parfum', badgeColor: 'purple' },
      { id: 42, name: 'Eau de toilette', badgeColor: 'blue' },
    ],
  },
  {
    id: 5,
    title: 'Ongles',
    icon: 'RiHandHeartLine',
    subcategories: [
      { id: 51, name: 'Vernis à ongles', badgeColor: 'pink' },
      { id: 52, name: 'Soins des ongles', badgeColor: 'green' },
    ],
  },
  {
    id: 6,
    title: 'Accessoires beauté',
    icon: 'RiStarSmileLine',
    subcategories: [
      { id: 61, name: 'Pinceaux maquillage', badgeColor: 'orange' },
      { id: 62, name: 'Éponges', badgeColor: 'yellow' },
      { id: 63, name: 'Trousse beauté', badgeColor: 'blue' },
    ],
  },
  {
    id: 7,
    title: 'Soins du corps',
    icon: 'RiBodyScanLine',
    subcategories: [
      { id: 71, name: 'Crèmes corporelles', badgeColor: 'green' },
      { id: 72, name: 'Exfoliants', badgeColor: 'purple' },
    ],
  },
  {
    id: 8,
    title: 'Produits Bio',
    icon: 'RiLeafLine',
    subcategories: [
      { id: 81, name: 'Soins visage bio', badgeColor: 'green' },
      { id: 82, name: 'Maquillage bio', badgeColor: 'pink' },
    ],
  },
  {
    id: 9,
    title: 'Solaires',
    icon: 'RiSunLine',
    subcategories: [
      { id: 91, name: 'Crèmes solaires', badgeColor: 'yellow' },
      { id: 92, name: 'Après-soleil', badgeColor: 'blue' },
    ],
  },
  {
    id: 10,
    title: 'Épilations',
    icon: 'RiScissorsCutLine',
    subcategories: [
      { id: 101, name: 'Cires épilation', badgeColor: 'red' },
      { id: 102, name: 'Crèmes dépilatoires', badgeColor: 'purple' },
    ],
  },
]


// Props
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

// Events
const emit = defineEmits(['close'])
const onClose = () => {
  emit('close'); // Émettez l'événement lorsque l'utilisateur clique sur la croix
};
// States
const openCategory = ref(null)
const openSubcategory = ref(null)
const selectedNotification = ref({})

// Mode Dark automatique (optionnel, dépend de tailwind dark class)
const isDarkMode = computed(() => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
})

function toggleCategory(index) {
  openCategory.value = openCategory.value === index ? null : index
  openSubcategory.value = null
}

function toggleSubcategory(id) {
  openSubcategory.value = openSubcategory.value === id ? null : id
}

function openModal(id) {
  const item = findSubcategoryById(id)
  selectedNotification.value = item || {}
  document.getElementById('my_modal_3').showModal()
}

function findSubcategoryById(id) {
  for (const category of props.notifications) {
    for (const sub of category.subcategories) {
      if (sub.id === id) return sub
      if (sub.children) {
        for (const child of sub.children) {
          if (child.id === id) return child
        }
      }
    }
  }
  return null
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

function badgeColor(color) {
  const colors = {
    red: 'bg-red-400',
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    yellow: 'bg-yellow-400',
    pink: 'bg-pink-400',
    purple: 'bg-purple-400',
    orange: 'bg-orange-400',
  }
  return colors[color] || 'bg-gray-400'
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
