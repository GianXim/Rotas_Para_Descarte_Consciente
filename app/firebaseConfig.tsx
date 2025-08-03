// Importe os tipos e funções que você precisa do SDK
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { FirebaseOptions } from "firebase/app";

// TODO: Adicione aqui a configuração do seu projeto Firebase
// que você copiou do console.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBJD4AztNC7i3t3wwNAkwKq_fpMtrOQxwM",
  authDomain: "ambiente-9af16.firebaseapp.com",
  projectId: "ambiente-9af16",
  storageBucket: "ambiente-9af16.appspot.com",
  messagingSenderId: "673361340410",
  appId: "1:673361340410:web:b063a780f2f495df932643",
  measurementId: "G-CSRZRCE28B"
};

// Inicializa o Firebase e armazena a instância do app
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializa o Cloud Firestore e o exporta para ser usado em outros lugares
const db: Firestore = getFirestore(app);

// Exporta a instância do banco de dados para ser usada no seu app
export { db };