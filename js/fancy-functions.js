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

// Creates a random session
function randomSession() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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