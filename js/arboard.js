// Erases top layer (drawings, not image)
globals.erase = function () {
    prevJSON = project.activeLayer.exportJSON();
    clearedLast = true;
    project.activeLayer.removeChildren();
    globals.requestSave();
}

// Changes the color of the pen from the jscolor picker
// www.jscolor.com
globals.colorChange = function (jscolor) {
    if (opacity > 0) {
        prevColor = jscolor.toHEXString();
        color = jscolor.toHEXString();
    } else {
        jscolor.fromString('#ffffff');
        color = '#FFFFFF';
    }
}

// Changes stroke width of pen
globals.strokeChange = function (s) {
    stroke = s;
}

// Change opacity of pen,
// changes color to white if eraser is chosen
globals.opacityChange = function (o) {
    if (o > 0) {
        opacity = o;
        color = prevColor;
        globals.eraserToggle(color);
    } else {
        opacity = o;
        prevColor = color;
        color = '#FFFFFF';
        globals.eraserToggle(color);
    }
}

// Loads database JSON into paper.js
globals.loadJSON = function (json, cleared) {
    clearedLast = cleared;
    project.activeLayer.removeChildren();
    project.activeLayer.importJSON(json);
}

// Rescales the paper.js view by the top-left corner Point(x: 0, y: 0)
globals.scale = function () {
    if (globals.tsWidth > 0 && globals.tsHeight > 0) {
        var w = parseInt(globals.tsWidth);
        var wt = parseInt(project.activeLayer.view.size.width);
        var h = parseInt(globals.tsHeight);
        var ht = parseInt(project.activeLayer.view.size.height);
        project.activeLayer.view.scale(wt / w, ht / h, new Point(0, 0));
        globals.updateImageScale(wt / w, ht / h);
    }
}

// Shorthand for saving into Firebase
globals.requestSave = function () {
    globals.saveJSON(project.activeLayer.exportJSON(), project.activeLayer.view.size.width, project.activeLayer.view.size.height, globals.tpWidth, globals.tpHeight, clearedLast);
}

// Removes last drawn object
globals.undo = function () {
    undos.unshift(project.activeLayer.exportJSON());
    if (clearedLast) {
        clearedLast = false;
        project.activeLayer.importJSON(prevJSON);
        globals.requestSave();
    } else {
        var removed = project.activeLayer.lastChild.remove();
        if (removed) globals.requestSave();
    }
}

// Redraws last undo
globals.redo = function () {
    if (undos.length > 0) {
        var json = undos.shift();
        project.activeLayer.importJSON(json);
        globals.requestSave();
    }
}

var path;
var color = "#000000";
var prevColor, prevJSON, clearedLast = false,
    undos = [];
var stroke = 10;
var opacity = 1;

// Color choices are done, drawing layer is now active
var drawingLayer = new Layer();

// On all mouse and touch down events create a new path
function onMouseDown(event) {
    // Create a new path and set its stroke color to color choice
    path = new Path({
        segments: [event.point],
        strokeColor: color,
        strokeWidth: stroke,
        opacity: opacity
    });
}

// While the user drags the mouse, points are added to the path
// at the position of the mouse
function onMouseDrag(event) {
    path.add(event.point);
}

// When the mouse is released, we simplify the path
function onMouseUp(event) {
    var segmentCount = path.segments.length;

    // When the mouse is released, simplify it:
    path.simplify(10);

    clearedLast = false;
    globals.requestSave();
}

// Rescale on resize
function onResize() {
    globals.scale();
}