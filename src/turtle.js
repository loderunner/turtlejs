
/**
 * Renders the turtle on a canvas element.
 * @constructor
 * @param {(string|HTMLCanvasElement)} element - A HTMLCanvasElement to render onto or the id of a HTMLCanvasElement.
 * @property {HTMLCanvasElement} canvasElement - The HTMLCanvasElement to render on.
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

Object.defineProperty(TurtleRenderer.prototype, 'canvasElement', {
    get: function() { return this._canvasElement; }
});

/**
 * Returns the context to draw the background on. This context is not directly linked to
 * an on-screen canvas. Use [render]{@link TurtleRenderer.prototype.render} to render
 * to the document's canvas.
 * @return {CanvasRenderingContext2D} the context to draw the background on.
 */
TurtleRenderer.prototype.getBackgroundContext() {
    return this._backgroundLayer.getContext('2d', {alpha:'false'});
}

/**
 * Returns the context to draw the foreground on. This context is not directly linked to
 * an on-screen canvas. Use [render]{@link TurtleRenderer.prototype.render} to render
 * to the document's canvas.
 * @return {CanvasRenderingContext2D} the context to draw the foreground on.
 */
TurtleRenderer.prototype.getForegroundContext() {
    return this._foregroundLayer.getContext('2d', {alpha:'true'});
}

/**
 * Renders the turtle context
 * @param {Turtle} turtle - The turtle context to render on the canvas.
 */
TurtleRenderer.prototype.render = function(turtle) {
    const ctx = this._canvas.getContext('2d', {alpha:'true'});

    // Draw background layer
    const bgCtx = this.getBackgroundContext();
    const bgImgData = bgCtx.getImageData();
    ctx.putImageData(bgImageData);

    // Draw foreground layer
    const fgCtx = this.getForegroundContext();
    const fgImgData = fgCtx.getImageData();
    ctx.putImageData(fgImageData);
}



/**
 * Represents a turtle drawing context.
 * @constructor
 * @property {Number} x - The current x coordinate of the turtle.
 * @property {Number} y - The current y coordinate of the turtle.
 * @property {Number} orientation - The current angle the turtle is heading.
 * @property {Image} turtleImage - The image used to represent the turtle.
 * @property {TurtleRenderer} rendererer - The turtle's renderer
 */ 
function Turtle() {
    this._x = 0;
    this._y = 0;
    this._orientation = 0;
    this._turtleImage = Turtle.defaultTurtleImage;
}

Object.defineProperty(Turtle.prototype, 'renderer', {
    get: function() { return this._renderer; },
    set: function(r) { this._renderer = r; this._renderer.render(); }
});
Object.defineProperty(Turtle.prototype, 'x', {
    get: function() { return this._x; },
    set: function(x) { this._x = x; }
});
Object.defineProperty(Turtle.prototype, 'y', {
    get: function() { return this._y; },
    set: function(y) { this._y = y; }
});
Object.defineProperty(Turtle.prototype, 'orientation', {
    get: function() { return this._orientation; },
    set: function(o) { this._orientation = o; }
});
Object.defineProperty(Turtle.prototype, 'turtleImage', {
    get: function() { return this._turtleImage; },
    set: function(i) { this._turtleImage = i; }
});

/**
 * Moves the turtle to an (absolute) position.
 * @param {Number} x - the x coordinate of the target position
 * @param {Number} y - the y coordinate of the target position
 */
 Turtle.prototype.moveTo = function(x, y) {


    this.x = x;
    this.y = y;
 }

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
