
/**
 * Renders the turtle on a canvas element.
 * @constructor
 * @param {string|HTMLCanvasElement} element - A HTMLCanvasElement to render onto or the id of a HTMLCanvasElement.
 */ 
function TurtleRenderer(element) {
    var el;
    if (typeof(element) === typeof('')) {
        el = document.getElementById(element);
        if (!el) {
            throw new Error("No element #" + String(element));
        }
    }
    if (!(el instanceof HTMLCanvasElement)) {
        throw new TypeError("#" + String(element) + " is not a HTMLCanvasElement");
    }

    // Set drawing canvas
    this._canvasElement = el;

    // Create layers
    this._backgroundLayer = this._canvasElement.cloneNode();
    this._foregroundLayer = this._canvasElement.cloneNode();

    // Load turtle image
    this._turtleImage = new Image();
    this._turtleImage.src = '../img/turtle.png';
    this._turtleImage.onload = function() {};
}

/**
 * The HTMLCanvasElement to render onto.
 * @memberof TurtleRenderer.prototype
 */
Object.defineProperty(TurtleRenderer.prototype, 'canvasElement', {
    get: function() { return this._canvasElement; }
});

TurtleRenderer.prototype.render = function() {
    const ctx = this._canvas.getContext('bitmaprenderer');

    const bgCtx = this._backgroundLayer.getContext('2d', {alpha:'true'});
}



/**
 * Represents a turtle drawing context.
 * @constructor
 */ 
function Turtle() {
    this._x = 0;
    this._y = 0;
    this._orientation = 0;
}

Object.defineProperty(Turtle.prototype, 'renderer', {
    get: function() { return this._renderer; },
    set: function(r) { this._renderer = r; }
});

Turtle.makeTurtle = function(element) {
    let turtle = new Turtle();
    turtle.renderer = new TurtleRenderer(element);
}

window.Turtle = Turtle;