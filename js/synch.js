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
var ourUser = firebase.auth().currentUser;

// Called whenever authentication changes (sign in or out)
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // Display client login password if tutor is logged in
        // Hide client login password for client [even though they already have password, they shouldn't invite new people]
        if (user.isAnonymous) {
            $("#client-password").css({
                display: "none"
            });
        } else {
            var params = new URLSearchParams(window.location.search);
            var sessionName = params.get("session");
            $("#client-password").html("Client Password: " + sessionName);
        }
        ourUser = user;
        console.log("Welcome! " + user.isAnonymous ? "You are not anonymous." : "You are anonymous.");
        authenticated = true;
    } else {
        user = null;
        console.log("Goodbye");
        authenticated = false;
    }
});

// Saves paper.js data
window.globals.saveJSON = function (json) {
    var params = new URLSearchParams(window.location.search);
    var sessionName = params.get("session");
    if (ourUser.isAnonymous) {
        firebase.database().ref('sessions/' + sessionName).update({
            data: json,
            client: "present"
        });
    } else {
        firebase.database().ref('sessions/' + sessionName).update({
            data: json
        });
    }
}

// Called everytime data is updated for paper.js in database
var params = new URLSearchParams(window.location.search);
var sessionName = params.get("session");
var jsonDataUpdate = firebase.database().ref('sessions/' + sessionName + "/data");
var whole = firebase.database().ref('sessions/' + sessionName);
jsonDataUpdate.on('value', function (snapshot) {
    globals.loadJSON(snapshot.val());
});

whole.on('value', function (snapshot) {
    if (snapshot.val() == null) {
        document.location.href = "session-ended.html";
    }
});

// Ends current session
function endSession() {
    firebase.database().ref('sessions/' + sessionName).remove();
    document.location.href = "session-ended.html";
}