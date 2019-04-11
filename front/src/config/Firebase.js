import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


// Initialize Firebase
const DB_CONFIG = {
    apiKey: "AIzaSyDx1nW83id3S5qeTHTf4AZUvttj1TnOalU",
    authDomain: "mwafront.firebaseapp.com",
    databaseURL: "https://mwafront.firebaseio.com",
    projectId: "mwafront",
    storageBucket: "mwafront.appspot.com",
    messagingSenderId: "150686074611"
};

const Fire = firebase.initializeApp(DB_CONFIG);

export default Fire;
