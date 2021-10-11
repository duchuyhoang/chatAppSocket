"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageRef = exports.db = exports.app = void 0;
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
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
exports.app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, storage_1.getStorage)(exports.app);
const storageRef = (name) => (0, storage_1.ref)(exports.db, name);
exports.storageRef = storageRef;
