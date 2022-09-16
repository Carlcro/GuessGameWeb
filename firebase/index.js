// firebase/index.js
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/messaging";

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
  const messaging = firebase.messaging();

  Notification.requestPermission()
    .then((result) => {
      console.log(result);
      return messaging.getToken();
    })
    .then((token) => {
      console.log("token", token);
    });
}
const auth = firebase.auth();
export { auth, firebase };
