// Importe os tipos e funções que você precisa do SDK
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { FirebaseOptions } from "firebase/app";

// TODO: Adicione aqui a configuração do seu projeto Firebase
// que você copiou do console.
const firebaseConfig: FirebaseOptions = {
  apiKey: "SUA CHAVE DE API",
  authDomain: "SEU DOMÍNIO",
  projectId: "SEU ID",
  storageBucket: "SUAS CREDENCIAIS",
  messagingSenderId: "SEU ID",
  appId: "SEU APP ID",
  measurementId: "SEU ID"
};

// Inicializa o Firebase e armazena a instância do app
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializa o Cloud Firestore e o exporta para ser usado em outros lugares
const db: Firestore = getFirestore(app);

// Exporta a instância do banco de dados para ser usada no seu app
export { db };
