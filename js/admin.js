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

                window.location.href = "administrator.html";
            } else {
                alert('You do not have permissions to be here.');
                window.location.href = "index.html";
            }
        });
    }
});

// Signs into the ArBoard system after ensuring that email and password are valid
function login() {
    var email = document.getElementById('signin-email').value;
    var password = document.getElementById('signin-password').value;

    // Log in to Firebase
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Error signing in. Your email or password may be incorrect.");
        console.log("Error signing in: " + errorCode + " -> " + errorMessage);
    });
}