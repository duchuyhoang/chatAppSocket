import admin from "firebase-admin";
var serviceAccount = require("./cresentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "fileserver-620be.appspot.com",
});

const bucket = admin.storage().bucket();

export default bucket;
