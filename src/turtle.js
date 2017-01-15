const defaultTurtleImageData = 
    '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';


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
TurtleRenderer.prototype.getBackgroundContext = function() {
    return this._backgroundLayer.getContext('2d', {alpha:'false'});
}

/**
 * Returns the context to draw the foreground on. This context is not directly linked to
 * an on-screen canvas. Use [render]{@link TurtleRenderer.prototype.render} to render
 * to the document's canvas.
 * @return {CanvasRenderingContext2D} the context to draw the foreground on.
 */
TurtleRenderer.prototype.getForegroundContext = function() {
    return this._foregroundLayer.getContext('2d', {alpha:'true'});
}

/**
 * Renders the turtle context
 * @param {Turtle} turtle - The turtle context to render on the canvas.
 */
TurtleRenderer.prototype.render = function(turtle) {
    const ctx = this._canvasElement.getContext('2d', {alpha:'true'});

    // Draw background layer
    {
        const bgCtx = this.getBackgroundContext();
        const bgImgData = bgCtx.getImageData(
            0, 
            0,
            this._backgroundLayer.width,
            this._backgroundLayer.height
        );
        ctx.putImageData(bgImgData, 0, 0);
    }

    // Draw foreground layer
    {
        const fgCtx = this.getForegroundContext();
        const fgImgData = fgCtx.getImageData(
            0,
            0, 
            this._foregroundLayer.width,
            this._foregroundLayer.height
        );
        ctx.putImageData(fgImgData, 0, 0);
    }
}



/**
 * Represents a turtle drawing context.
 * @constructor
 * @property {Number} x - The current x coordinate of the turtle.
 * @property {Number} y - The current y coordinate of the turtle.
 * @property {Number} orientation - The current angle the turtle is heading.
 * @property {Object} turtleImage - (write-only) The image used to represent the turtle. The
 * type can be any type accepted by CanvasRenderingContext2D.drawImage
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
    set: function(r) { this._renderer = r; this._renderer.render(this); }
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
    set: function(i) { this._turtleImage = i; }
});

/**
 * Moves the turtle to an (absolute) position.
 * @param {Number} x - the x coordinate of the target position
 * @param {Number} y - the y coordinate of the target position
 */
 Turtle.prototype.moveTo = function(x, y) {

    if (this.renderer) {
        this.renderer.drawLine(this._x, this._y, x, y);
        this.render(this);
    }

    this.x = x;
    this.y = y;
 }

/**
 * The default turtle image.
 * @type {Image}
 */
Turtle.defaultTurtleImage = new Image();
Turtle.defaultTurtleImage.src = 'data:image/png;base64,' + defaultTurtleImageData;

/**
 * Creates and returns a turtle drawing context that renders on the given HTMLCanvasElement or id.
 * @return {Turtle} a new turtle drawing context
 */
Turtle.makeTurtle = function(element) {
    let turtle = new Turtle();
    turtle.renderer = new TurtleRenderer(element);
}

window.Turtle = Turtle;
