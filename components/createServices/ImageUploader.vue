<script lang="ts" setup>
import { Trash2, Upload } from "lucide-vue-next";
const emit = defineEmits(["update:files"]);
defineProps({
  error: {
    type: String,
    default: "",
  },
});

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const rawFiles = ref<{ file: File; preview: string }[]>([]);
const errorMessage = ref("");

// Formatte les fichiers pour l'API
const formattedFiles = computed(() => {
  return rawFiles.value.map((file) => ({
    base64: file.preview.split(",")[1], // Extrait la partie base64
    mime_type: file.file.type,
    file_name: file.file.name,
    size: file.file.size,
    isNew: true,
    preview: file.preview, // Gardé pour la prévisualisation
  }));
});

// Met à jour les fichiers formatés quand rawFiles change
watch(
  formattedFiles,
  (newVal) => {
    emit("update:files", newVal);
  },
  { deep: true }
);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const validateFile = (file: File): boolean => {
  if (!file.type.match("image.*")) {
    errorMessage.value = "Seules les images sont acceptées.";
    return false;
  }

  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = "La taille de l'image ne doit pas dépasser 5 Mo.";
    return false;
  }

  return true;
};

const processFiles = (files: FileList) => {
  errorMessage.value = "";

  if (rawFiles.value.length + files.length > 5) {
    errorMessage.value = "Vous ne pouvez pas sélectionner plus de 5 images.";
    return;
  }

  Array.from(files).forEach((file) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          rawFiles.value.push({
            file,
            preview: e.target.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  });
};

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    processFiles(input.files);
    input.value = "";
  }
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files.length) {
    processFiles(event.dataTransfer.files);
  }
};

const removeFile = (index: number) => {
  rawFiles.value.splice(index, 1);
};
</script>

<template>
  <div :class="{ 'border-red-500 border-2': $props.error }">
    <!-- Zone de drop et sélection -->
    <div
      class="border-2 border-dashed border-slate-500 rounded-lg p-8 mb-6 transition-all duration-300 cursor-pointer"
      :class="{ 'bg-blue-50 border-blue-500': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <div class="flex flex-col items-center justify-center text-center">
        <i class="fas fa-cloud-upload-alt text-5xl text-blue-500 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          {{
            isDragging
              ? "Déposez vos fichiers ici"
              : "Déposez vos images ici ou cliquez pour sélectionner"
          }}
        </h3>
        <p class="text-gray-500 mb-4">
          Formats acceptés: JPG, PNG, GIF (5 Mo max.)
        </p>
        <button
          type="button"
          class="bg-slate-900 hover:bg-gold hover:text-slate-900 text-gold py-2 px-6 flex items-center rounded transition-colors duration-300 whitespace-nowrap"
        >
          <Upload class="mr-2 h-4 w-4" />Parcourir
        </button>
      </div>
    </div>

    <!-- Input file caché -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="onFileSelected"
    />

    <!-- Barre de progression -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>Images sélectionnées</span>
        <span>{{ formattedFiles.length }}/5</span>
      </div>
      <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-gold transition-all duration-300"
          :style="{ width: `${(formattedFiles.length / 5) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div
      v-if="errorMessage"
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
    >
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle mr-2"></i>
        <p>{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Prévisualisation des images -->
    <div v-if="formattedFiles.length > 0" class="mb-8">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">
        Aperçu des images
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div
          v-for="(file, index) in formattedFiles"
          :key="index"
          class="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
        >
          <img
            :src="file.preview"
            alt="Aperçu"
            class="w-full h-full object-cover object-top"
          />
          <div
            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"
          ></div>
          <button
            type="button"
            @click.stop="removeFile(index)"
            class="absolute top-2 right-2 bg-slate-900 hover:bg-gold text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer whitespace-nowrap"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
