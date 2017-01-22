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

    this._foregroundLayer = document.createElement('canvas');
    this._foregroundLayer.width = width;
    this._foregroundLayer.height = height;
    this.getForegroundContext().lineWidth = .5;
    this.getForegroundContext().transform(1, 0, 0, -1, width/2, height/2);
}

Object.defineProperty(TurtleRenderer.prototype, 'canvasElement', {
    get: function() { return this._canvasElement; }
});

/**
 * Returns the context to draw the foreground on. This context is not directly linked to
 * an on-screen canvas. Use [render]{@linkcode TurtleRenderer#render} to render
 * to the document's canvas.
 * @return {CanvasRenderingContext2D} the context to draw the foreground on.
 */
TurtleRenderer.prototype.getForegroundContext = function() {
    return this._foregroundLayer.getContext('2d', {alpha:'true'});
}

TurtleRenderer.prototype.renderIfNeeded = function(turtle) {
    if (!this._dirty) {
        this._dirty = true;
        const self = this;
        requestAnimationFrame(function() { self.render(turtle); });
    }
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
        ctx.save();
        ctx.fillStyle = turtle.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    // Draw foreground layer
    {
        ctx.save();
        ctx.drawImage(this._foregroundLayer, 0, 0);
        ctx.restore();
    }

    // Draw turtle
    {
        if (turtle.show) {
            const img = turtle.turtleImage;

            ctx.save();
            ctx.transform(1, 0, 0, -1, width/2, height/2);
            ctx.translate(turtle.x, turtle.y);
            ctx.rotate(turtle._orientation);
            ctx.drawImage(img, -img.naturalWidth/2, -img.naturalHeight/2);
            ctx.restore();
        }
    }

    this._dirty = false;
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
 * Represents a turtle drawing context.
 * @constructor
 * @property {Number} x - The current x coordinate of the turtle.
 * @property {Number} y - The current y coordinate of the turtle.
 * @property {Number} orientation - The current angle the turtle is heading.
 * @property {boolean} show - If `true` the turtle is visible, hidden if `false`.
 * @property {boolean} radians - `true` if the orientation units are in radians, in degrees if `false`. Defaults to `false`.
 * @property {string} backgroundColor - The color of the background. Value is a CSS color returned as a string.
 * @property {Object} turtleImage - (write-only) The image used to represent the turtle.
 * type can be any type accepted by CanvasRenderingContext2D.drawImage
 */ 
function Turtle() {
    this._x = 0;
    this._y = 0;
    this._orientation = 0;
    this._radians = false;
    this._show = true;
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
    get: function() { 
        if (this._radians) {
            return this._orientation;
        } else {
            return 180 * this._orientation / Math.PI;
        }
    }
});
Object.defineProperty(Turtle.prototype, 'show', {
    get: function() { return this._show; }
});
Object.defineProperty(Turtle.prototype, 'radians', {
    get: function() { return this._radians; },
    set: function(r) { this._radians = r; }
});
Object.defineProperty(Turtle.prototype, 'backgroundColor', {
    get: function() { return this._backgroundColor; }
});
Object.defineProperty(Turtle.prototype, 'turtleImage', {
    get: function() { return this._turtleImage; },
    set: function(i) { this._turtleImage = i; }
});

/**
 * The default turtle image.
 * @type {Image}
 */
Turtle.defaultTurtleImage = new Image();
Turtle.defaultTurtleImage.src = 'data:image/png;base64,' + defaultTurtleImageData;

/**
 * Moves the turtle to an (absolute) position.
 * @param {Number} x - the x coordinate of the target position
 * @param {Number} y - the y coordinate of the target position
 */
Turtle.prototype.moveTo = function(x, y) {

    if (this._renderer) {
        const renderer = this._renderer;
        renderer.drawLine(this._x, this._y, x, y);
        renderer.renderIfNeeded(this);
    }

    this._x = x;
    this._y = y;
}

/**
 * Moves the turtle forward in the direction it's headed.
 * @param {Number} distance - the distance the turtle should move forward
 */
Turtle.prototype.forward = function(distance) {
    const x = this._x + distance * Math.cos(this._orientation);
    const y = this._y + distance * Math.sin(this._orientation);
    this.moveTo(x, y);
}

/**
 * Moves the turtle backwards from the direction it's headed. This does not change the turtle's orientation.
 * @param {Number} distance - the distance the turtle should move backwards
 */
Turtle.prototype.back = function(distance) {
    const x = this._x - distance * Math.cos(this._orientation);
    const y = this._y - distance * Math.sin(this._orientation);
    this.moveTo(x, y);
}

/**
 * Turns the turtle clockwise by `angle`. `angle` is measured in degrees, unless {@linkcode radians} is `true`.
 * @param {Number} angle - the amount the turtle orientation changes clockwise
 */
Turtle.prototype.right = function(angle) {
    if (this._radians) {
        this._orientation -= angle;
    } else {
        this._orientation -= angle * Math.PI / 180;
    }

    if (this._renderer) {
        this._renderer.renderIfNeeded(this);
    }
}

/**
 * Turns the turtle counterclockwise by `angle`. `angle` is measured in degrees, unless {@linkcode radians} is `true`.
 * @param {Number} angle - the amount the turtle orientation changes counterclockwise
 */
Turtle.prototype.left = function(angle) {
    if (this._radians) {
        this._orientation += angle;
    } else {
        this._orientation += angle * Math.PI / 180;
    }
    
    if (this._renderer) {
        this._renderer.renderIfNeeded(this);
    }
}

/**
 * Sets the background color.
 * @param {Color} color - the background color
 */
Turtle.prototype.background = function(color) {
    this._backgroundColor = color;

    if (this._renderer) {
        this._renderer.renderIfNeeded(this);
    }
}

/**
 * Hides the turtle. When the turtle is hidden, it cannot be seen yet it will still draw onto the context.
 */
Turtle.prototype.hide = function() {
    this._show = false;

    if (this._renderer) {
        this._renderer.renderIfNeeded(this);
    }
}

/**
 * Shows the turtle. The turtle will be drawn onto the context.
 */
Turtle.prototype.show = function() {
    this._show = true;

    if (this._renderer) {
        this._renderer.renderIfNeeded(this);
    }
}

/** 
 * Aliases
 */

/**
 * Alias of [forward]{@linkcode Turtle#forward}
 * @function Turtle.prototype.fd
 * @param distance
 */
Turtle.prototype.fd = Turtle.prototype.forward;
/**
 * Alias of [back]{@linkcode Turtle#back}
 * @function Turtle.prototype.fd
 * @param distance
 */
Turtle.prototype.bk = Turtle.prototype.back;
/**
 * Alias of [left]{@linkcode Turtle#left}
 * @function Turtle.prototype.fd
 * @param distance
 */
Turtle.prototype.lt = Turtle.prototype.left;
/**
 * Alias of [right]{@linkcode Turtle#right}
 * @function Turtle.prototype.fd
 * @param distance
 */
Turtle.prototype.rt = Turtle.prototype.right;
/**
 * Alias of [background]{@linkcode Turtle#background}
 * @function Turtle.prototype.fd
 * @param distance
 */
Turtle.prototype.bg = Turtle.prototype.background;
/**
 * Alias of [show]{@linkcode Turtle#show}
 * @function Turtle.prototype.fd
 * @param distance
 */
Turtle.prototype.st = Turtle.prototype.show;
/**
 * Alias of [hide]{@linkcode Turtle#hide}
 * @function Turtle.prototype.fd
 * @param distance
 */
Turtle.prototype.ht = Turtle.prototype.hide;

/**
 * Creates and returns a turtle drawing context that renders on the given HTMLCanvasElement or id.
 * @return {Turtle} a new turtle drawing context
 */
Turtle.makeTurtle = function(element) {
    let turtle = new Turtle();
    turtle._renderer = new TurtleRenderer(element);
    turtle._renderer.renderIfNeeded(turtle);

    return turtle;
}

window.Turtle = Turtle;
