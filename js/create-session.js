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

// Initialize client email to nothing
var clientName = "";
var clientEmail = "";

// Tutor Information
var tutorID = "";
var tutorName = "";
var tutorEmail = "";

// Get session name
var session = randomSession();

// Dropdown should show who you clicked
$(function () {
    $("#clients").on('click', 'a', function () {
        clientEmail = $(this).attr('title');
        console.log(clientEmail);
        $(".btn:first-child").text($(this).text());
        $(".btn:first-child").val($(this).text());
    });
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        tutorEmail = user.email;
        // Check if user is an administrator
        db.ref('admins').orderByChild('email').equalTo(user.email).once("value", function (snapshot) {
            if (snapshot.exists()) {
                snapshot.forEach(function (child) {
                    // Get first and last name, add it to welcome
                    var firstname = child.child("firstname").val();
                    var lastname = child.child("lastname").val();
                    tutorName = firstname + " " + lastname;
                    $("#title-welcome").html("Welcome " + tutorName);

                    // Get tutor ID
                    tutorID = child.key;

                    // Populate client list
                    var clients = child.child("clients");
                    populateClientList(clients);

                    // Add session to account
                    db.ref('tutors/' + child.key).update({
                        session: session
                    });
                });

            } else {
                // Check if user is a tutor
                db.ref('tutors').orderByChild('email').equalTo(user.email).once("value", function (snapshot) {
                    if (snapshot.exists()) {
                        snapshot.forEach(function (child) {
                            // Get first and last name, add it to welcome
                            var firstname = child.child("firstname").val();
                            var lastname = child.child("lastname").val();
                            tutorName = firstname + " " + lastname;
                            $("#title-welcome").html("Welcome " + tutorName);

                            // Get tutor ID
                            tutorID = child.key;

                            // Populate client list
                            var clients = child.child("clients");
                            populateClientList(clients);

                            // Add session to account
                            db.ref('tutors/' + child.key).update({
                                session: session
                            });
                        });

                    } else {
                        // If not admin or tutor, send back to homepage
                        window.location.href = "index.html";
                    }
                });
            }
        });
    } else {
        window.location.href = "index.html";
    }
});

// Populates the client dropdown list
function populateClientList(clients) {
    var select = document.getElementById("clients");
    // Loop through each client in client list
    clients.forEach(function (client) {
        // Get email and name
        var firstname = client.child("firstname").val();
        var lastname = client.child("lastname").val();
        var email = client.child("email").val();

        // Add to option object
        var option = document.createElement("a");
        option.innerHTML = firstname + ' ' + lastname;
        option.title = email;
        option.classList.add("dropdown-item");
        option.href = "#";
        select.appendChild(option);
    });
}

// Invites the selected client to the new session
function invite() {
    if (clientEmail.length > 0) {
        // Add session to client account
        db.ref('clients').orderByChild('email').equalTo(clientEmail).once('value', function (snapshot) {
            if (snapshot.exists()) {
                clientID = "";
                // Loop through each client, should be one
                snapshot.forEach(function (child) {
                    // Get client information
                    clientID = child.key;
                    clientName = child.child("firstname").val() + " " + child.child("lastname").val();

                    // Save session name
                    db.ref('clients/' + child.key).update({
                        session: session
                    });
                });

                // Save session client data
                db.ref('sessions/' + session + '/client').set({
                    id: clientID,
                    name: clientName,
                    email: clientEmail
                });

                // Save session tutor data
                db.ref('sessions/' + session + '/tutor').set({
                    id: tutorID,
                    name: tutorName,
                    email: tutorEmail
                });

                // Go to ArBoard
                window.location.href = "arboard.html?session=" + session;
            } else {
                alert("This client has not created an ArBoard account.");
            }
        });
    } else {
        alert("Please select a client; if there are no clients available, then your client is not eligible for ArBoard at this time.");
        return;
    }
}

function signout() {
    firebase.auth().signOut();
}