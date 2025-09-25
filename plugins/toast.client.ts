import "vue-toastification/dist/index.css";
import Toast from 'vue-toastification'
import { POSITION } from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'


export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    transition: "Vue-Toastification__fade",
    maxToasts: 30, 
  };

  nuxtApp.vueApp.use(Toast, options);
  nuxtApp.provide('toast', Toast)
});
