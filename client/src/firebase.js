import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAQJ6Azmsy7Uf6mb8BfNxaYMPM4lcQVlPg",
    authDomain: "budget-calculator-ceba6.firebaseapp.com",
    projectId: "budget-calculator-ceba6",
    storageBucket: "budget-calculator-ceba6.appspot.com",
    messagingSenderId: "403312219841",
    appId: "1:403312219841:web:c816dfeee451fde671a640",
    measurementId: "G-QMBDNPKM6P"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth }