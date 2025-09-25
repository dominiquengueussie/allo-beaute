import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faShoppingCart, faCalendarAlt, faUserCircle, faTimes, faArrowRight, faStar, faMapMarkerAlt, faPhoneAlt, faEnvelope, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faTwitter, faCcVisa, faCcMastercard, faCcPaypal, faCcApplePay } from '@fortawesome/free-brands-svg-icons'

config.autoAddCss = false
library.add(faShoppingCart, faCalendarAlt, faUserCircle, faTimes, faArrowRight, faStar, faMapMarkerAlt, faPhoneAlt, faEnvelope, faMinus, faPlus, faFacebookF, faInstagram, faTwitter, faCcVisa, faCcMastercard, faCcPaypal, faCcApplePay)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})