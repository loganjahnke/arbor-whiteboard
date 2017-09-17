// Initialize Firebase
var config = {
    apiKey: "AIzaSyCN7FEYgg6lUTF_AAxrpYsax-taEpuucp4",
    authDomain: "arboard-1fe52.firebaseapp.com",
    databaseURL: "https://arboard-1fe52.firebaseio.com",
    projectId: "arboard-1fe52",
    storageBucket: "arboard-1fe52.appspot.com",
    messagingSenderId: "435636183402"
};
var app = firebase.initializeApp(config);
var database = firebase.database();
var authenticated = false;

// Called whenever authentication changes (sign in or out)
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("Welcome! " + user.isAnonymous ? "You are not anonymous." : "You are anonymous.");
        authenticated = true;
    } else {
        console.log("Goodbye");
        authenticated = false;
    }
});

// Check for authentication
window.onload = function () {
    authenticate();
}

// If user is not tutor, sign in anonymously (assuming its client)
// If accessing non-tutor created session, revoke access
function authenticate() {
    if (authenticated) {
        createSession(firebase.auth().currentUser.email);
    } else {
        firebase.database().ref('sessions/' + sessionName + "/data").once('value').then(function (snapshot) {
            if (snapshot.exists()) {
                firebase.auth().signInAnonymously().catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("Error signing in anonymously: " + errorCode + " -> " + errorMessage);
                });
            }
        });
    }

    return false;
}

// Saves paper.js data
window.globals.saveJSON = function (json) {
    var params = new URLSearchParams(window.location.search);
    var sessionName = params.get("session");
    firebase.database().ref('sessions/' + sessionName).set({
        active: true,
        data: json
    });
}

// Called everytime data is updated for paper.js in database
var params = new URLSearchParams(window.location.search);
var sessionName = params.get("session");
var jsonDataUpdate = firebase.database().ref('sessions/' + sessionName + "/data");
jsonDataUpdate.on('value', function (snapshot) {
    globals.loadJSON(snapshot.val());
});