import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALmnC8CNzb72w5Dhzg0gbwoqMHG3xLD6k",
  authDomain: "allobeaute-2bc68.firebaseapp.com",
  projectId: "allobeaute-2bc68",
  storageBucket: "allobeaute-2bc68.firebasestorage.app",
  messagingSenderId: "644892511267",
  appId: "1:644892511267:web:bd3580d2d8f2f76dc9b596",
  measurementId: "G-77FMMRBYKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const useFirebaseAuth = () => {
  let confirmationResult = ref(null);
  let recaptchaVerifier = ref(null);

  const renderRecaptcha = (containerId) => {
    recaptchaVerifier.value = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    });
  };

  const phoneSendAuth = async (phoneNumber) => {
    try {
      confirmationResult.value = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.value
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const verifyCode = async (code) => {
    try {
      const result = await confirmationResult.value.confirm(code);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    renderRecaptcha,
    phoneSendAuth,
    verifyCode,
  };
};
