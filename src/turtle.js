const defaultTurtleImageData = 
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAjklEQVRIx2P4z0AZZBg1YNQAuhjQ82ze' +
    '7B/qDLgBIQNsgITc/7QXy/r/y5NtAASq/s95tK71vwTZBkCg7r+iu9sr/wuRbQAEmv6ruLo//z8v2QaA' +
    'IMv/0m/v48g0wORf2TUyXaD9r/DuVvLCQPV/9qO1bWTFgiwwHSyeQGY66H42dw5FKXE0O48aMDQMAABL' +
    '48DaqA6zBwAAAABJRU5ErkJggg==';


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
        throw new TypeError("#" + String(element) + " is not a string or HTMLCanvasElement");
    }

    // Set drawing canvas
    this._canvasElement = el;
    const width = this._canvasElement.width;
    const height = this._canvasElement.height;

    // Create layers
    this._backgroundLayer = document.createElement('canvas');
    this._backgroundLayer.width = width;
    this._backgroundLayer.height = height;

    this._foregroundLayer = document.createElement('canvas');
    this._foregroundLayer.width = width;
    this._foregroundLayer.height = height;
    this.getForegroundContext().transform(1, 0, 0, -1, width/2, height/2);
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
    const width = this._canvasElement.width;
    const height = this._canvasElement.height;

    // Draw background layer
    {
        ctx.drawImage(this._backgroundLayer, 0, 0);
    }

    // Draw foreground layer
    {
        ctx.drawImage(this._foregroundLayer, 0, 0);
    }

    // Draw turtle
    {
        const img = turtle.turtleImage;

        ctx.save();
        ctx.transform(1, 0, 0, -1, width/2, height/2);
        ctx.translate(turtle.x - img.naturalWidth/2, turtle.y - img.naturalHeight/2);
        ctx.rotate(turtle.orientation);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }
}

/**
 * Draw a line between two points.
 * @param {Number} x0 - The x coordinate of the start point
 * @param {Number} x0 - The y coordinate of the start point
 * @param {Number} x1 - The x coordinate of the end point
 * @param {Number} x1 - The y coordinate of the end point
 */
TurtleRenderer.prototype.drawLine = function(x0, y0, x1, y1) {
    const ctx = this.getForegroundContext();

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

/**
 * Fills the background with the given color.
 * @param {string} color - A string parsed as a CSS color
 */
TurtleRenderer.prototype.fillBackground = function(color) {
    const ctx = this.getBackgroundContext();
    const width = this._canvasElement.width;
    const height = this._canvasElement.height;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}



/**
 * Represents a turtle drawing context.
 * @constructor
 * @property {Number} x - The current x coordinate of the turtle.
 * @property {Number} y - The current y coordinate of the turtle.
 * @property {Number} orientation - The current angle the turtle is heading.
 * @property {string} backgroundColor - The color of the background. Value is a CSS color returned as a string.
 * @property {Object} turtleImage - (write-only) The image used to represent the turtle. The
 * type can be any type accepted by CanvasRenderingContext2D.drawImage
 */ 
function Turtle() {
    this._x = 0;
    this._y = 0;
    this._orientation = 0;
    this._turtleImage = Turtle.defaultTurtleImage;
    this._backgroundColor = "#ffffff";
}

Object.defineProperty(Turtle.prototype, 'x', {
    get: function() { return this._x; }
});
Object.defineProperty(Turtle.prototype, 'y', {
    get: function() { return this._y; }
});
Object.defineProperty(Turtle.prototype, 'orientation', {
    get: function() { return this._orientation; }
});
Object.defineProperty(Turtle.prototype, 'backgroundColor', {
    get: function() { return this._backgroundColor; }
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

    if (this._renderer) {
        const turtle = this;
        const renderer = this._renderer;
        renderer.drawLine(this._x, this._y, x, y);
        requestAnimationFrame(function() { renderer.render(turtle); });
    }

    this._x = x;
    this._y = y;
}

/**
 * Moves the turtle forward in the direction it's headed.
 * @param {Number} distance - the distance the turtle should move forward
 */
Turtle.prototype.forward = function(distance) {
    const x = distance * Math.cos(this._orientation);
    const y = distance * Math.sin(this._orientation);
    this.moveTo(x, y);
}

/**
 * Sets the background color.
 * @param {Color} color - the background color
 */
Turtle.prototype.background = function(color) {

    if (this._renderer) {
        const turtle = this;
        const renderer = this._renderer;
        renderer.fillBackground(color);
        requestAnimationFrame(function() { renderer.render(turtle); });
    }

    this._backgroundColor = color;
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
    turtle._renderer = new TurtleRenderer(element);
    requestAnimationFrame(function() { turtle._renderer.render(turtle); });

    return turtle;
}

window.Turtle = Turtle;
