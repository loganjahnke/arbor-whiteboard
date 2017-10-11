// Erases top layer (drawings, not image)
globals.erase = function () {
    project.activeLayer.removeChildren();
    globals.saveJSON(project.activeLayer.exportJSON(), project.activeLayer.view.size.width, project.activeLayer.view.size.height, globals.tpWidth, globals.tpHeight);
}

globals.colorChange = function (jscolor) {
    color = jscolor.toHEXString();
}

// Changes stroke width of pen
globals.strokeChange = function (s) {
    stroke = s;
}

// Change opacity of pen
globals.opacityChange = function (o) {
    opacity = o;
}

// Loads database JSON into paper.js
globals.loadJSON = function (json) {
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

globals.requestSave = function () {
    globals.saveJSON(project.activeLayer.exportJSON(), project.activeLayer.view.size.width, project.activeLayer.view.size.height, globals.tpWidth, globals.tpHeight);
}

// Removes last drawn object
globals.undo = function () {
    var removed = project.activeLayer.lastChild.remove();
    if (removed) globals.saveJSON(project.activeLayer.exportJSON(), project.activeLayer.view.size.width, project.activeLayer.view.size.height, globals.tpWidth, globals.tpHeight);
}

var path;
var color = "black";
var stroke = 2;
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

    globals.saveJSON(project.activeLayer.exportJSON(), project.activeLayer.view.size.width, project.activeLayer.view.size.height, globals.tpWidth, globals.tpHeight);
}

function onResize() {
    globals.scale();
}