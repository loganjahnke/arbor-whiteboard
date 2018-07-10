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
    storageBucket: "arboard-test.appspot.com",
    messagingSenderId: "8013625199"
};

var app = firebase.initializeApp(config);
var db = firebase.database();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // Check if user is an administrator
        db.ref('admins').orderByChild('email').equalTo(user.email).once("value", function (snapshot) {
            if (snapshot.exists()) {
                // Get datetime
                var datetime = getCurrentDateTime();

                // Loop through snapshot (it's only one child)
                snapshot.forEach(function (child) {
                    db.ref('admins/' + child.key).update({
                        latest_signin: datetime
                    })
                });

                window.location.href = "create-session.html";
            }
        });

        // Check if user is a tutor
        db.ref('tutors').orderByChild('email').equalTo(user.email).once("value", function (snapshot) {
            if (snapshot.exists()) {
                // Get datetime
                var datetime = getCurrentDateTime();

                // Loop through snapshot (it's only one child)
                snapshot.forEach(function (child) {
                    db.ref('tutors/' + child.key).update({
                        latest_signin: datetime
                    })
                });

                window.location.href = "create-session.html";
            }
        });

        // Check if user is a client
        db.ref('clients').orderByChild('email').equalTo(user.email).once("value", function (snapshot) {
            if (snapshot.exists()) {
                // Get datetime
                var datetime = getCurrentDateTime();

                // Loop through snapshot (it's only one child)
                snapshot.forEach(function (child) {
                    db.ref('clients/' + child.key).update({
                        latest_signin: datetime
                    });

                    // Get latest session name from tutor, join it automatically
                    var session = child.child("session").val();
                    if (session.length < 5) {
                        alert("Your tutor has not invited you to a session yet.");
                        window.location.href = "index.html";
                    } else {
                        window.location.href = "arboard.html?session=" + session;
                    }
                });

                
            }
        });
    }
});

// Ensures that email is in the system.
function validateSignInEmail() {
    var email = document.getElementById('signin-email').value;
    console.log(email);
    // Make sure email is not flagged
    db.ref('valid-emails').orderByChild('email').equalTo(email).once("value", function (snapshot) {
        console.log(snapshot.val());
        if (!snapshot.exists()) {
            $('#signin-error').html("This email has either been deactivated or is not in our system.");
        }
    });
}

// Ensures that email is eligible to sign up.
function validateSignUpEmail() {
    var email = document.getElementById('signup-email').value;
    // Make sure email is not flagged
    db.ref('valid-emails').orderByChild('email').equalTo(email).once("value", function (snapshot) {
        if (!snapshot.exists()) {
            $('#signup-error').html("This email is not currently eligible. Please use your main tutor email or main client email.");
        }
    });
}

// Checks to make sure password is long enough.
function validatePasswordLength() {
    if (document.getElementById('signup-password').value.length < 8) {
        $('#signup-password-length-error').html("Your password must be at least 8 characters long.");
        return false;
    } else {
        $('#signup-password-length-error').html("");
        return true;
    }
}

// Checks to make sure password confimation is correct.
function validatePasswordConfirm() {
    if (document.getElementById('signup-password').value != document.getElementById('signup-confirm-password').value) {
        $('#signup-password-confirm-error').html("Your confirmation must match your password.");
        return false;
    } else {
        $('#signup-password-confirm-error').html("");
        return true;
    }
}

// Signs into the ArBoard system after ensuring that email and password are valid
function login() {
    var email = document.getElementById('signin-email').value;
    var password = document.getElementById('signin-password').value;
    // Make sure email is not flagged
    db.ref('valid-emails').orderByChild('email').equalTo(email).once("value", function (snapshot) {
        if (!snapshot.exists()) {
            $('#signin-error').html("This email has either been deactivated or is not in our system.");
            alert("This email has either been deactivated or is not in our system.");
        } else {
            // Log in to Firebase
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert("Error signing in. Your email or password may be incorrect.");
                console.log("Error signing in: " + errorCode + " -> " + errorMessage);
            });
        }
    });
}

// Registers the new account into the system after ensuring that email and password are valid
function register() {
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;
    var confirm_password = document.getElementById('signup-confirm-password').value;

    // If password validation critera fails, stop creation
    if (!validatePasswordLength() || !validatePasswordConfirm()) {
        alert("Check password critera");
        return;
    }

    // Make sure email is not flagged
    db.ref('valid-emails').orderByChild('email').equalTo(email).once("value", function (snapshot) {
        if (!snapshot.exists()) {
            $('#signup-error').html("This email is not currently eligible. Please use your main tutor email or main client email.");
            alert("This email is not currently eligible. Please use your main tutor email or main client email.");
        } else {
            // Create new account
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
                console.log("Created new account!");
            }).catch(function (error) {
                console.log(error);
                alert("We couldn't enroll your email into our system, maybe you are already enrolled.");
            });
        }
    });
}