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
    storageBucket: "",
    messagingSenderId: "8013625199"
};
var app = firebase.initializeApp(config);
var database = firebase.database();
var authenticated = false;
var ourUser = firebase.auth().currentUser;
var isAnonymous = false;

var downloadURL = "";
var imageKeepName = "";

// Called whenever authentication changes (sign in or out)
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        isAnonymous = user.isAnonymous;
        // Display client login password if tutor is logged in
        // Hide client login password for client [even though they already have password, they shouldn't invite new people]
        if (user.isAnonymous) {
            $("#invite").hide();
        } else {
            var sessionName = searchParams("session", window.location.search);
            document.title = "Session: " + sessionName;
        }
        ourUser = user;
        console.log("Welcome! " + user.isAnonymous ? "You are anonymous." : "You are not anonymous.");
        console.log("Email: " + user.email);
        authenticated = true;
    } else {
        user = null;
        console.log("Goodbye");
        authenticated = false;
        document.location.href = "session-ended.html";
    }
});

// Saves paper.js data
window.globals.saveJSON = function (json, width, height, tpw, tph, lastCleared) {
    var sessionName = searchParams("session", window.location.search);
    if (ourUser.isAnonymous) {
        firebase.database().ref('sessions/' + sessionName).update({
            data: json,
            client: "present",
            lastCleared: lastCleared
        });
    } else {
        if (tpw == null) tpw = -1;
        if (tph == null) tph = -1;
        if (globals.tsWidth == null) {
            firebase.database().ref('sessions/' + sessionName).update({
                data: json,
                tsWidth: width,
                tsHeight: height,
                tpWidth: tpw,
                tpHeight: tph,
                lastCleared: lastCleared
            });
        } else {
            firebase.database().ref('sessions/' + sessionName).update({
                data: json,
                tpWidth: tpw,
                tpHeight: tph,
                lastCleared: lastCleared
            });
        }
    }
}

// Called everytime data is updated for paper.js in database
var sessionName = searchParams("session", window.location.search);
var imageUpdate, whole;
if (sessionName == "demo") {
    imageUpdate = firebase.database().ref(sessionName + "/image");
    whole = firebase.database().ref(sessionName);
} else {
    imageUpdate = firebase.database().ref('sessions/' + sessionName + "/image");
    whole = firebase.database().ref('sessions/' + sessionName);
}

// Everytime image is updated
imageUpdate.on('value', function (snapshot) {
    if (snapshot.val() == null) {
        clearImage();
    } else {
        downloadURL = snapshot.val();
        updateImage(downloadURL);
    }
});

// Check for delete
whole.on('value', function (snapshot) {
    if (snapshot.val() == null) {
        document.location.href = "session-ended.html";
    }

    if (snapshot.val().tsWidth != globals.tsWidth && snapshot.val().tsHeight != globals.tsHeight) {
        globals.tsWidth = snapshot.val().tsWidth;
        globals.tsHeight = snapshot.val().tsHeight;
        globals.scale();
    }

    if (snapshot.val().tpWidth != globals.tpWidth && snapshot.val().tpHeight != globals.tpHeight) {
        globals.tpWidth = snapshot.val().tpWidth;
        globals.tpHeight = snapshot.val().tpHeight;
        globals.scale();
    }

    if (snapshot.val().data != null) {
        globals.loadJSON(snapshot.val().data, snapshot.val().lastCleared);
    }
});

// Ends current session
function endSession() {
    firebase.database().ref('sessions/' + sessionName).remove();
    document.location.href = "session-ended.html";
}

// Deletes image from storage
function deleteImage() {
    firebase.database().ref('sessions/' + sessionName + "/image").remove();
}

// Search parameters to get session id
function searchParams(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

// Uploads an image to the database
function uploadImage(imageName, image) {
    // Create a root reference
    var storageRef = firebase.storage().ref();

    // File or Blob named mountains.jpg
    var file = image;
    imageKeepName = file.name;

    // Create the file metadata
    var metadata = {
        contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

            case 'storage/canceled':
                // User canceled the upload
                break;

            case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
        }
    }, function () {
        // Upload completed successfully, now we can get the download URL
        downloadURL = uploadTask.snapshot.downloadURL;
        globals.uploaded = true;
        updateImage(downloadURL);
        firebase.database().ref('sessions/' + sessionName).update({
            image: downloadURL
        });
    });

}