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
        // document.location.href = "index.html";
    }
});

function register() {
    var fname = $('#first-name').val();
    var lname = $('#last-name').val();
    var yfname = $('#your-first-name').val();
    var ylname = $('#your-last-name').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var admin_password = $('#admin-password').val();

    if (!validateEmail(email)) {
        alert("Invalid email address.");
        return false;
    }

    if (password.length < 6) {
        alert("Password must be 6 characters or more.");
        return false;
    }

    if (fname == null || fname.length == 0) {
        alert("Tutor first name is required.");
        return false;
    }

    if (lname == null || lname.length == 0) {
        alert("Tutor last name is required.");
        return false;
    }

    if (yfname == null || yfname.length == 0) {
        alert("Your first name is required.");
        return false;
    }

    if (ylname == null || ylname.length == 0) {
        alert("Your last name is required.");
        return false;
    }

    if (admin_password != "ArBoard2018?") {
        alert("Invalid administrator password.");
        return false;
    }

    var datetime = getCurrentDateTime();

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
        firebase.database().ref('tutor/' + user.uid).set({
            firstName: fname,
            lastName: lname,
            createdBy: yfname + " " + ylname,
            created: datetime,
            email: email
        }).then(function (json) {
            alert("Successfully made new account with email: " + email);
            document.location.href = "register.html";
        }).catch(function (error) {
            console.log("Error creating tutor: " + error);
            alert("There was an error saving new tutor data. Please try again. If error persists, please contact network administrator.");
        });
    }).catch(function (error) {
        console.log(error);
        alert("There was an error creating a new tutor. Please try again. If error persists, please contact network administrator.");
    });

    return false;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Get current date in date time format
function getCurrentDateTime() {
    var currentdate = new Date();
    // Components
    var year = currentdate.getFullYear();
    var month = (currentdate.getMonth() + 1) < 10 ? "0" + (currentdate.getMonth() + 1) : currentdate.getMonth() + 1;
    var day = currentdate.getDate() < 10 ? "0" + currentdate.getDate() : currentdate.getDate();
    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();
    var seconds = currentdate.getSeconds();
    // Datetime format
    return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
}