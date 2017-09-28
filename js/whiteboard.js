var canvas, ctx, w, h; // NOTE: probably not needed anymore, keep here til certain
var imageLoader;

// PaperScript Interop
window.globals = {
    erase: function () {},
    strokeChange: function (s) {},
    opacityChange: function (o) {},
    loadJSON: function (json) {},
    saveJSON: function (json) {},
    scale: function (width, height) {},
    tsHeight: 0,
    tsWidth: 0
}

// Initialize non-paper.js stuff
function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * 0.96;
    canvas.height = window.innerHeight * 0.96;

    w = canvas.width;
    h = canvas.height;

    $("#clr").click(window.globals.erase);

    $("#stroke").slider({
        min: 0.5,
        max: 50,
        step: 0.5,
        value: 2,
        animate: "fast",
        change: function () {
            window.globals.strokeChange($("#stroke").slider("value"));
        }
    });

    $("#opacity").slider({
        min: 0,
        max: 1,
        value: 1,
        step: 0.01,
        animate: "fast",
        change: function () {
            window.globals.opacityChange($("#opacity").slider("value"));
        }
    });
}

// Image reading
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            updateImage(e.target.result);
            uploadImage(e.target.result, input.files[0]);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function updateImage(link) {
    if (link == "" || link == null) clearImage();
    else $('#curr-image').attr('src', link);
}

// Removes image from screen
function clearImage() {
    deleteImage();
    $('#curr-image').attr('src', "images/white.gif");
}