// Initialize Firebase (Arboard Server)
// var config = {
//     apiKey: "AIzaSyCN7FEYgg6lUTF_AAxrpYsax-taEpuucp4",
//     authDomain: "arboard-1fe52.firebaseapp.com",
//     databaseURL: "https://arboard-1fe52.firebaseio.com",
//     projectId: "arboard-1fe52",
//     storageBucket: "arboard-1fe52.appspot.com",
//     messagingSenderId: "435636183402"
// };

// Test Server
var config = {
    apiKey: "AIzaSyBMGyuv9l2Y-IyGaoxt8YS4IBHyYXDFa-M",
    authDomain: "arboard-test.firebaseapp.com",
    databaseURL: "https://arboard-test.firebaseio.com",
    projectId: "arboard-test",
    storageBucket: "",
    messagingSenderId: "8013625199"
};
var app = firebase.initializeApp(config);
var db = firebase.database();

function reset() {
    var email = document.getElementById('signin-email').value;
    // Make sure email is not flagged
    db.ref('valid-emails').orderByChild('email').equalTo(email).once("value", function (snapshot) {
        console.log(snapshot.val());
        if (!snapshot.exists()) {
            $('#signin-error').html("This email has either been deactivated or is not in our system.");
            alert("This email is not eligible for a password reset.");
        } else {
            // Send password reset if email is valid
            firebase.auth().sendPasswordResetEmail(email).then(function () {
                alert("An email has been sent so you can reset your password.");
                document.location.href = "index.html";
            }).catch(function (error) {
                alert("Cannot send reset email right now. Try again later.");
            });
        }
    });
}

// Ensures that email is in the system.
function validateSignInEmail() {
    var email = document.getElementById('signin-email').value;
    // Make sure email is not flagged
    db.ref('valid-emails').orderByChild('email').equalTo(email).once("value", function (snapshot) {
        console.log(snapshot.val());
        if (!snapshot.exists()) {
            $('#signin-error').html("This email has either been deactivated or is not in our system.");
        }
    });
}