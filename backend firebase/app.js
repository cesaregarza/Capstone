
var firebase = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://petsrgv.firebaseio.com/"
});

var db = firebase.database();
var ref = db.ref("restricted_access/secret_document");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

var usersRef = ref.child("users");
usersRef.set({
  alanisawesome1: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop1: {
    date_of_birth: "December 9, 19061",
    full_name: "Grace Hopper"
  }
});