// Initialize Firebase
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

// Dropdown should show who you clicked
$(function () {

    var error = searchParams("error", window.location.search);

    // If unauthorized:
    if (error == "unauthorized") {
        document.getElementById('error-message').innerHTML = "You are not authorized to join this session.";
    }

    // If timeout:
    if (error == "timeout") {
        document.getElementById('error-message').innerHTML = "This session has expired.";
    }

    if (error == "closed") {
        document.getElementById('error-message').innerHTML = "This session has been closed.";
    }

    // Sign out user
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });

});