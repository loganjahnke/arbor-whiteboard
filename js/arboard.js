// Erases top layer (drawings, not image)
globals.erase = function () {
    project.activeLayer.removeChildren();
    globals.saveJSON(project.activeLayer.exportJSON(), project.activeLayer.view.size.width, project.activeLayer.view.size.height);
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
    }
}

var path;
var color = "black";
var stroke = 2;
var opacity = 1;

var colorNames = ["black", "red", "yellow", "green", "blue", "purple"];
var colors = [];
var colorSize = 40;

var uiLayer = project.activeLayer;

// Initialize color choices for pen in uiLayer
for (var i = 1; i <= colorNames.length; i++) {
    var rect = new Rectangle({
        x: view.size.width - i * colorSize * 1.2 - 10,
        y: colorSize / 2,
        width: colorSize,
        height: colorSize
    });

    var shape = Shape.Rectangle(rect);
    shape.strokeColor = "black";
    shape.fillColor = colorNames[i - 1];

    colors.push(shape);
}



// Color choices are done, drawing layer is now active
var drawingLayer = new Layer();

// On all mouse and touch down events create a new path
function onMouseDown(event) {
    // Change color if pointing at color
    for (var i = 0; i < colors.length; i++) {
        if (colors[i].contains(event.point)) {
            color = colorNames[i];
        }
    }

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

    globals.saveJSON(project.activeLayer.exportJSON(), project.view.size.width, project.view.size.height);
}

function onResize() {
    globals.scale();
}