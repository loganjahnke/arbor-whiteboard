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
var createPlz = false;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        isAnonymous = user.isAnonymous;
        console.log("Welcome " + user.email);
        authenticated = true;
        if (createPlz) authenticate(isAnonymous);
    } else {
        console.log("Goodbye");
        authenticated = false;
    }
});

// Authenticate the user
function authenticate(anonymous) {
    if (authenticated) {
        if (anonymous) {
            logClient($("#first-name").val(), $("#last-name").val(), $("#email-address").val());
        } else {
            logTutor(firebase.auth().currentUser.email);
        }
    } else {
        if (anonymous) {
            firebase.auth().signInAnonymously().catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("Error signing in anonymously: " + errorCode + " -> " + errorMessage);
            });
        } else {
            createPlz = true;
            var email = $("#login").val();
            var password = $("#password").val();
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert("Error signing in. Check password.");
                console.log("Error signing in: " + errorCode + " -> " + errorMessage);
            });
        }
    }

    return false;
}

// Logs the client in the database
function logClient(fname, lname, email) {
    var currentdate = new Date();
    var datetime = (currentdate.getMonth() + 1) + "/" +
        currentdate.getDate() + "/" +
        currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds();
    firebase.database().ref('client/' + email.replace(/[^a-zA-Z0-9]/g,'_')).update({
        firstName: fname,
        lastName: lname,
        lastActive: datetime
    }).then(function (json) {
        console.log("Successfully logged client.");
        joinSession($("#session-password").val());
    }).catch(function (error) {
        console.log("Error logging client: " + error);
        alert("There was an error joining this session. Please try again.");
    });
}

// Log the tutor in the database
function logTutor(email) {
    var currentdate = new Date();
    var datetime = (currentdate.getMonth() + 1) + "/" +
        (currentdate.getDate() + 1) + "/" +
        currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds();
    firebase.database().ref('tutor/' + firebase.auth().currentUser.uid).update({
        lastActive: datetime
    }).then(function (json) {
        console.log("Successfully logged tutor.");
        createSession();
    }).catch(function (error) {
        console.log("Error logging tutor: " + error);
        alert("There was an error creating a session. Please try again.");
    });
}

// Creates a session, can only be called by tutor
function createSession() {
    var sessionNumber = randomSession();
    var currentdate = new Date();
    var datetime = (currentdate.getMonth() + 1) + "/" +
        (currentdate.getDate() + 1) + "/" +
        currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds();
    firebase.database().ref('sessions/' + sessionNumber).set({
        active: true,
        tutorID: firebase.auth().currentUser.uid,
        dateCreated: datetime
    }).then(function (json) {
        console.log("Successfully created session.");
        document.location.href = "arboard.html?session=" + sessionNumber;
    }).catch(function (error) {
        console.log("Error creating session: " + error);
    });
}

// Joins a session in progress, need password to get in
function joinSession(sessionPassword) {
    if (sessionPassword == "demo") {
        document.location.href = "arboard.html?session=demo";
    } else {
        firebase.database().ref('sessions/' + sessionPassword.replace(/\s+/g, '-')).once('value').then(function (snapshot) {
            if (snapshot.val()) {
                document.location.href = "arboard.html?session=" + sessionPassword.replace(/\s+/g, '-');
            } else {
                alert("Invalid password.");
            }
        }).catch(function (error) {
            alert("Error: " + error);
        });
    }
}

// Creates a random session
function randomSession() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// Show login buttons
function showLogin() {
    firebase.auth().signOut();
    authenticated = false;
    if (authenticated && !isAnonymous) {
        $("#login-form").css({
            display: "none"
        });

        $("#short-login-form").css({
            display: "block"
        });

        $("#welcome").css({
            display: "none"
        });
    } else {
        $("#short-login-form").css({
            display: "none"
        });

        $("#login-form").css({
            display: "block"
        });

        $("#welcome").css({
            display: "none"
        });
    }
}

// Sign out tutor if logged in
function showJoin() {
    firebase.auth().signOut();

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