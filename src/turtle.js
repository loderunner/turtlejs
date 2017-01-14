
/**
 * Renders the turtle on a canvas element.
 * @constructor
 * @param {(string|HTMLCanvasElement)} element - A HTMLCanvasElement to render onto or the id of a HTMLCanvasElement.
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
}

/**
 * The HTMLCanvasElement to render onto.
 * @memberof TurtleRenderer
 * @type {HTMLCanvasElement}
 */
Object.defineProperty(TurtleRenderer.prototype, 'canvasElement', {
    get: function() { return this._canvasElement; }
});

/**
 * renders the turtle context
 * @param {Turtle} turtle - The turtle context to render on the canvas.
 */
TurtleRenderer.prototype.render = function(turtle) {
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
    this._turtleImage = Turtle.defaultTurtleImage;
}

Object.defineProperty(Turtle.prototype, 'renderer', {
    get: function() { return this._renderer; },
    set: function(r) { this._renderer = r; }
});

/**
 * The default turtle image.
 * @type {Image}
 */
Turtle.defaultTurtleImage = new Image();
Turtle.defaultTurtleImage.src = '../img/turtle.png';

/**
 * Creates and returns a turtle drawing context that renders on the given HTMLCanvasElement or id.
 * @return {Turtle} a new turtle drawing context
 */
Turtle.makeTurtle = function(element) {
    let turtle = new Turtle();
    turtle.renderer = new TurtleRenderer(element);
}

window.Turtle = Turtle;
