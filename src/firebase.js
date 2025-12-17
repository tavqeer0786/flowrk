import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Safety Check
const missingKeys = Object.entries(firebaseConfig)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

if (missingKeys.length > 0) {
    console.error("Missing Firebase Configuration Keys:", missingKeys);
    // Alert the user visibly
    if (typeof window !== 'undefined') {
        // Create a permanent overlay to warn the user
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '0';
        div.style.left = '0';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.backgroundColor = 'rgba(0,0,0,0.9)';
        div.style.color = 'white';
        div.style.zIndex = '9999';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.padding = '20px';
        div.innerHTML = `
            <h1 style="color: #ef4444; font-size: 2rem; margin-bottom: 1rem;">Setup Required</h1>
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">The following Firebase configuration keys are missing:</p>
            <ul style="text-align: left; margin-bottom: 2rem; color: #fca5a5;">
                ${missingKeys.map(k => `<li>${k}</li>`).join('')}
            </ul>
            <p>Please create a <code>.env</code> file in the project root and add these values.</p>
        `;
        document.body.appendChild(div);
    }
}

// Initialize Firebase only if config is valid to avoid fatal crash loops
const app = missingKeys.length === 0 ? initializeApp(firebaseConfig) : initializeApp({
    // fallback dummy config to prevent sync crashes, though database calls will fail
    apiKey: "dummy",
    projectId: "dummy"
});

const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
