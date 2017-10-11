var canvas, ctx, w, h; // NOTE: probably not needed anymore, keep here til certain
var imageLoader;

var ih = 85;
var iw = 45;

var defaultSize = 0.75;

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
    tsWidth: -1,
    tpHeight: -1,
    tpWidth: -1,
    uploaded: false
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
            uploadImage(e.target.result, input.files[0]);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function updateImage(link) {
    if (globals.uploaded) {
        var img = new Image();
        img.onload = function () {
            var height = img.height;
            var width = img.width;

            var sheight = screen.height;
            var swidth = screen.width;

            // Accounting for phone and iPad orientation
            if (sheight > swidth) {
                var t = sheight;
                sheight = swidth;
                swidth = t;
            }

            if (height > width) {
                ih = defaultSize; // 75% of screen for image height
                var newH = (ih * sheight);
                iw = (newH / height * width) / swidth;
                while (iw > 1.0) {
                    ih -= 0.02;
                    newH = (ih * sheight);
                    iw = (newH / height * width) / swidth;
                }
            } else {
                iw = defaultSize; // 75% of screen for image width
                var newW = (iw * swidth);
                ih = (newW / width * height) / sheight;
                while (ih > 1.0) {
                    iw -= 0.02;
                    newW = (iw * swidth);
                    ih = (newW / width * height) / sheight;
                }
            }
            ih *= 100;
            iw *= 100;
            globals.tpHeight = ih;
            globals.tpWidth = iw;
            globals.uploaded = false;
            window.globals.requestSave();
            window.globals.scale();
        }
        img.src = link;
    }

    if (link == "" || link == null) clearImage();
    else $('#curr-image').attr('src', link);
}

globals.updateImageScale = function (w, h) {
    $('#curr-image').css({
        height: (h * globals.tpHeight) + "%",
        width: (w * globals.tpWidth) + "%"
    });
}

// Removes image from screen
function clearImage() {
    deleteImage();
    $('#curr-image').attr('src', "images/white.gif");
    globals.tpHeight = -1;
    globals.tpWidth = -1;
}