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

$(function () {
    var dots = '';
    var delay = false;
    setInterval(() => {
        if (delay) {
            $("#waiting").html('Waiting for Tutor');
        } else {
            $("#waiting").html('Waiting for Tutor' + dots);
        }

        if (dots.length == 3) {
            dots = '';
            delay = true;
        } else {
            if (!delay) {
                dots += '.';
            } else {
                delay = false;
            }
        }
    }, 600);
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // Check if user is an client
        db.ref('clients').orderByChild('email').equalTo(user.email).once("value", function (snapshot) {
            if (snapshot.exists()) {
                snapshot.forEach(function (child) {
                    $('#title-welcome').html('Welcome ' + child.child('firstname').val());
                    db.ref('clients/' + child.key + '/session').on('value', (snapshot) => {
                        if (snapshot.val() != null && snapshot.val().length > 4) {
                            window.location.href = "arboard.html?session=" + snapshot.val();
                        }
                    });
                });
            }
        });
    } else {
        window.location.href = "index.html";
    }
});

function signout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "admin.html";
    });
}