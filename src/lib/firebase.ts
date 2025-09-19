import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyDT4RJ0wkBgh0fFH9KLrt6OckF3NuuAZ3s',
	authDomain: 'team-cardinalis.firebaseapp.com',
	databaseURL: 'https://team-cardinalis-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'team-cardinalis',
	storageBucket: 'team-cardinalis.appspot.com',
	messagingSenderId: '322452435812',
	appId: '1:322452435812:web:team-cardinalis'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
