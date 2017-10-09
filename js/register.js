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

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.location.href = "index.html";
    }
});

function register() {
    var email = $('#email').val();
    var password = $('#password').val();

    if (!validateEmail(email)) {
        alert("Invalid email address.");
        return false;
    }

    if (password.length < 6) {
        alert("Password must be 6 characters or more.");
        return false;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
        document.location.href = "index.html";
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Error registering account: " + errorMessage);
    });

    return false;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}