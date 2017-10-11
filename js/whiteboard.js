var canvas, ctx, w, h; // NOTE: probably not needed anymore, keep here til certain
var imageLoader;

// PaperScript Interop
window.globals = {
    erase: function () {},
    undo: function () {},
    colorChange: function (jsColor) {},
    strokeChange: function (s) {},
    opacityChange: function (o) {},
    loadJSON: function (json) {},
    saveJSON: function (json) {},
    scale: function () {},
    updateImageScale: function () {},
    requestSave: function () {},
    tsHeight: -1,
    tsWidth: -1
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
    $("#undo").click(window.globals.undo);

    $("#stroke").selectmenu({
        change: function () {
            window.globals.strokeChange($("#stroke").val());
        }
    });

    $("#opacity").selectmenu({
        change: function () {
            window.globals.opacityChange($("#opacity").val());
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
            window.globals.requestSave();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function updateImage(link) {
    if (link == "" || link == null) clearImage();
    else $('#curr-image').attr('src', link);
}

function updateImageScale(w, h) {
    $('#curr-image').css({
        height: (85 * h) + "%",
        width: (45 * w) + "%"
    })
}

// Removes image from screen
function clearImage() {
    deleteImage();
    $('#curr-image').attr('src', "images/white.gif");
}