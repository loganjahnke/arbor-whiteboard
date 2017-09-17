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

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("Welcome " + user.email);
        authenticated = true;
    } else {
        console.log("Goodbye");
        authenticated = false;
    }
});

function authenticate() {
    if (authenticated) {
        createSession(firebase.auth().currentUser.email);
    } else {
        var email = $("#login").val();
        var password = $("#password").val();
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error signing in: " + errorCode + " -> " + errorMessage);
        });
    }

    return false;
}

function createSession(email) {
    var sessionNumber = randomSession();

    firebase.database().ref('sessions/' + sessionNumber).set({
        active: true,
        tutor: email
    }).then(json => {
        console.log("Successfully created session.");
        document.location.href = "arboard.html?session=" + sessionNumber;
    }).catch(error => {
        console.log("Error creating session: " + error);
    });
}

function randomSession() {
    return "whiteboard-" + Math.floor(Math.random() * 16777215).toString(16);
}

function showLogin() {
    $("#login-form").css({
        display: "block"
    });

    $("#welcome").css({
        display: "none"
    });
}