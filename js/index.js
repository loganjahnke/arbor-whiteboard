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
var isAnonymous = false;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        isAnonymous = user.isAnonymous;
        console.log("Welcome " + user.email);
        authenticated = true;
    } else {
        console.log("Goodbye");
        authenticated = false;
    }
});

function authenticate(anonymous) {
    if (authenticated) {
        if (anonymous) {
            joinSession($("#session-password").val());
        } else {
            createSession(firebase.auth().currentUser.email);
        }
    } else {
        if (anonymous) {
            firebase.auth().signInAnonymously().catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("Error signing in anonymously: " + errorCode + " -> " + errorMessage);
            });
        } else {
            var email = $("#login").val();
            var password = $("#password").val();
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("Error signing in: " + errorCode + " -> " + errorMessage);
            });
        }
    }

    return false;
}

function createSession(email) {
    var sessionNumber;
    if ($("#session").val() != null) {
        sessionNumber = $("#session").val();
    } else {
        sessionNumber = randomSession();
    }

    firebase.database().ref('sessions/' + sessionNumber).set({
        active: true,
        tutor: email
    }).then(function (json) {
        console.log("Successfully created session.");
        document.location.href = "arboard.html?session=" + sessionNumber;
    }).catch(function (error) {
        console.log("Error creating session: " + error);
    });
}

function joinSession(sessionPassword) {
    firebase.database().ref('sessions/' + sessionPassword).once('value').then(function (snapshot) {
        if (snapshot.val()) {
            document.location.href = "arboard.html?session=" + sessionPassword;
        } else {
            alert("Invalid password.");
        }
    }).catch(function (error) {
        alert("Error: " + error);
    });
}

function randomSession() {
    return Math.floor(Math.random() * 16777215).toString(16) + "-" + Math.floor(Math.random() * 16777215).toString(16);
}

function showLogin() {
    if (authenticated && !isAnonymous) {
        $("#short-login-form").css({
            display: "block"
        });

        $("#welcome").css({
            display: "none"
        });
    } else {
        $("#login-form").css({
            display: "block"
        });

        $("#welcome").css({
            display: "none"
        });
    }
}

function showJoin() {
    $("#join-form").css({
        display: "block"
    });

    $("#welcome").css({
        display: "none"
    });
}

function backHome() {
    document.location.href = "index.html";
}