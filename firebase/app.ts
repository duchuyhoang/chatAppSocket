import { initializeApp } from 'firebase/app';
import { getStorage,ref} from "firebase/storage"
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7wvw2lJedPxnXKe52RkSP6cD3rURg_qA",
  authDomain: "fileserver-620be.firebaseapp.com",
  projectId: "fileserver-620be",
  storageBucket: "fileserver-620be.appspot.com",
  messagingSenderId: "183217495206",
  appId: "1:183217495206:web:4e055693e6684b4a0da867",
  measurementId: "G-T67RCN3P34"
};
export const app = initializeApp(firebaseConfig);
export const db = getStorage(app);
export const storageRef=
(name:string)=>ref(db,name);
