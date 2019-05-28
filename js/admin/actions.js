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

// Tutor Information
var tutorID = "";
var tutorName = "";
var tutorEmail = "";

// Client list and tutor list
var tutors = [];
var clients = [];

// Waiting
var isWaiting = false;

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
                });

            } else {
                window.location.href = "index.html";
            }
        });
    } else {
        window.location.href = "index.html";
    }
});

function createTutorObjects(data) {
    data.forEach(tutorJSON => {
        // Tutor Information
        let tutorFirstName = tutorJSON['Tutor First Name'];
        let tutorLastName = tutorJSON['Tutor Last Name'];
        let tutorEmail = tutorJSON['Tutor Email'];

        // Client Information
        let clientAccountNumber = tutorJSON['Account Phone number'];
        let clientFirstName = tutorJSON['Student First Name'];
        let clientLastName = tutorJSON['Student Last Name'];
        let clientEmail = tutorJSON['Student Email'];

        let tutorIndex = tutors.findIndex(tutor => {
            return tutor.firstname === tutorFirstName;
        });

        let clientIndex = clients.findIndex(client => {
            return client.firstname === clientFirstName;
        });
        
        let client = new Client(clientAccountNumber, clientFirstName, clientLastName, clientEmail);

        // Add client to tutor
        if (tutorIndex === -1) {
            // Create new tutor if not already in array
            let tutor = new Tutor(tutorFirstName, tutorLastName, tutorEmail, [client]);
            tutors.push(tutor);
        } else {
            let tutor = tutors[tutorIndex];
            tutor.clients.push(client);
            tutors[tutorIndex] = tutor;
        }

        // Client
        if (clientIndex === -1) {
            // Add client to array if not already there
            clients.push(client);
        }
    });
    return true;
}

function uploadToFirebase(data) {
    // Get tutors in object form
    let finished = createTutorObjects(data);

    // Setup references
    var validEmailsRef = db.ref('valid-emails');
    var tutorsRef = db.ref('tutors');
    var clientsRef = db.ref('clients');

    // First remove all valid email addresses
    validEmailsRef.remove();

    // Repopulate valid email addresses
    var validEmails = {};
    tutors.forEach(tutor => {
        // Add emails to valid email list
        validEmails[validEmailsRef.push().key] = { email: tutor.email };
        tutor.clients.forEach(client => {
            validEmails[validEmailsRef.push().key] = { email: client.email };
        });

        // Add clients to tutor
        tutorsRef.orderByChild('email').equalTo(tutor.email).once("value", (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(dbTutor => {
                    // Remove old clients
                    tutorsRef.child(dbTutor.key).child('clients').remove();
                    // Add new clients to tutor
                    addClientsToTutor(dbTutor.key, tutor.clients);
                });
            } else {
                // Create new tutor and add clients to tutor
                var key = createNewTutor(tutor);
            }
        });
    });

    clients.forEach(client => {
        // Add clients
        clientsRef.orderByChild('email').equalTo(client.email).once("value", (snapshot) => {
            if (!snapshot.exists()) {
                var key = createNewClient(client);
            }
        });
    });
    // Reset valid emails
    validEmailsRef.set(validEmails);
    isWaiting = false;
    checkForLoading();
}

function addClientsToTutor(tutorKey, clients) {
    db.ref('tutors').child(tutorKey).child('clients').set(clients);
}

function createNewTutor(tutor) {
    var newRef = db.ref('tutors').push();
    newRef.set({
        firstname: tutor.firstname,
        lastname: tutor.lastname,
        email: tutor.email,
        clients: tutor.clients
    });
    return newRef.key;
}

function createNewClient(client) {
    var newRef = db.ref('clients').push();
    newRef.set({
        accountNumber: client.accountNumber,
        firstname: client.firstname,
        lastname: client.lastname,
        email: client.email
    });
    return newRef.key;
}

function csv() {
    const asyncPromise = new Promise((resolve, reject) => {
        isWaiting = true;
        checkForLoading();
        var input = verifyBrowser(document.getElementById("spreadsheet-file"));
        if (input) {
            // Do file stuff
            let file = input.files[0];
            let reader = new FileReader();
            reader.readAsText(file);

            // On success, return the data
            reader.onload = (event) => {
                resolve(event.target.result);
            };

            // On failure, return nothing
            reader.onerror = (event) => {
                reject("Error reading file");
            };
        }
    });

    asyncPromise.then((csvString) => {
        uploadToFirebase($.csv.toObjects(csvString));
    });

    asyncPromise.catch((error) => {
        isWaiting = false;
        checkForLoading();
        alert("This file could not be parsed.");
    });
}

function verifyBrowser(input) {
    // Check for browser compatibility
    if (typeof window.FileReader !== 'function')
        throw ("The file API isn't supported on this browser.");
    if (!input)
        throw ("The browser does not properly implement the event object");
    if (!input.files)
        throw ("This browser does not support the `files` property of the file input.");
    if (!input.files[0])
        return undefined;
    return input;
}

function signout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "admin.html";
    });
}

function checkForLoading() {
    if (isWaiting) {
        $('body').addClass("loading");
    } else {
        $('body').removeClass("loading");
    }
}

function viewClients() {
    window.location.href = "admin/view/clients.html";
}