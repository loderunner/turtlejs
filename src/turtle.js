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
    this._foregroundContext = this._foregroundLayer.getContext('2d', {alpha:'true'});
    this._foregroundContext.lineWidth = .5;
    this._foregroundContext.transform(1, 0, 0, -1, width/2, height/2);
}

Object.defineProperty(TurtleRenderer.prototype, 'canvasElement', {
    get: function() { return this._canvasElement; }
});

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
        if (turtle.visible) {
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
 * @param {Number} color - The color of the line
 */
TurtleRenderer.prototype.drawLine = function(x0, y0, x1, y1, color) {
    const ctx = this._foregroundContext;

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

/**
 * Clears the current context.
 */
TurtleRenderer.prototype.clear = function() {
    const ctx = this._foregroundContext;

    ctx.clearRect(-this._canvasElement.width/2, -this._canvasElement.height/2, this._canvasElement.width, this._canvasElement.height);
}



/**
 * Represents a turtle drawing context.
 * @constructor
 * @property {Number} x - The current x coordinate of the turtle.
 * @property {Number} y - The current y coordinate of the turtle.
 * @property {Number} orientation - The current angle the turtle is heading.
 * @property {boolean} isPenDown - `true` when the pen is "down".
 * @property {boolean} visible - If `true` the turtle is visible, hidden if `false`.
 * @property {boolean} radians - `true` if the orientation units are in radians, in degrees if `false`. Defaults to `false`.
 * @property {string} penColor - The color of the pen, ie. the color the turtle draws new lines with. Value is a CSS color returned as a string.
 * @property {string} backgroundColor - The color of the background. Value is a CSS color returned as a string.
 * @property {Object} turtleImage - (write-only) The image used to represent the turtle.
 * type can be any type accepted by CanvasRenderingContext2D.drawImage
 */ 
function Turtle() {
    this._x = 0;
    this._y = 0;
    this._orientation = 0;
    this._radians = false;
    this._isPenDown = true;
    this._visible = true;
    this._turtleImage = Turtle.defaultTurtleImage;
    this._backgroundColor = "#ffffff";
    this._penColor = "#000000";
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
Object.defineProperty(Turtle.prototype, 'isPenDown', {
    get: function() { return this._isPenDown; }
});
Object.defineProperty(Turtle.prototype, 'visible', {
    get: function() { return this._visible; }
});
Object.defineProperty(Turtle.prototype, 'radians', {
    get: function() { return this._radians; },
    set: function(r) { this._radians = r; }
});
Object.defineProperty(Turtle.prototype, 'penColor', {
    get: function() { return this._penColor; }
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
 * @private
 * @param {Number} x - the x coordinate of the target position
 * @param {Number} y - the y coordinate of the target position
 */
Turtle.prototype._moveTo = function(x, y) {

    if (this._renderer) {
        const renderer = this._renderer;
        if (this.isPenDown) {
            renderer.drawLine(this._x, this._y, x, y, this._penColor);
        }
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
    this._moveTo(x, y);
}

/**
 * Moves the turtle backwards from the direction it's headed. This does not change the turtle's orientation.
 * @param {Number} distance - the distance the turtle should move backwards
 */
Turtle.prototype.back = function(distance) {
    const x = this._x - distance * Math.cos(this._orientation);
    const y = this._y - distance * Math.sin(this._orientation);
    this._moveTo(x, y);
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
 * Sets the pen color.
 * @param {Color} color - the pen color
 */
Turtle.prototype.color = function(color) {
    this._penColor = color;
}

/**
 * Hides the turtle. When the turtle is hidden, it cannot be seen yet it will still draw onto the context.
 */
Turtle.prototype.hide = function() {
    this._visible = false;

    if (this._renderer) {
        this._renderer.renderIfNeeded(this);
    }
}

/**
 * Shows the turtle. The turtle will be drawn onto the context.
 */
Turtle.prototype.show = function() {
    this._visible = true;

    if (this._renderer) {
        this._renderer.renderIfNeeded(this);
    }
}

/**
 * Puts the pen down. When the pen is down, the turtle draws when it moves.
 */
Turtle.prototype.penDown = function() {
    this._isPenDown = true;
}

/**
 * Puts the pen up. When the pen is "up", the turtle moves without drawing.
 */
Turtle.prototype.penUp = function() {
    this._isPenDown = false;
}

/**
 * Returns the turtle to the origin. If the pen is down, the turtle will draw a line from its current position.
 */
Turtle.prototype.home = function() {
    this._orientation = 0;
    this._moveTo(0, 0);
}

/**
 * Clears the drawing
 */
Turtle.prototype.clear = function() {
    if (this._renderer) {
        const renderer = this._renderer;
        renderer.clear();
        renderer.renderIfNeeded(this);
    }
}

/**
 * Runs the `actions` function `n` times. This is essentially a glorified `for` loop, a throwback to Logo.
 * @param {Number} n - The number of times `actions` is run
 * @param {function} actions - A function with the actions to repeat
 * @example <caption>Draw a square using repeat.</caption>
 * turtle.repeat(4, () => {
 *     turtle.forward(50);
 *     turtle.left(90);  
 * });
 */
Turtle.prototype.repeat = function(n, actions) {
    for (var i = 0; i < n; i++) {
        actions();
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
 * @function Turtle.prototype.bk
 * @param distance
 */
Turtle.prototype.bk = Turtle.prototype.back;
/**
 * Alias of [left]{@linkcode Turtle#left}
 * @function Turtle.prototype.lt
 * @param distance
 */
Turtle.prototype.lt = Turtle.prototype.left;
/**
 * Alias of [right]{@linkcode Turtle#right}
 * @function Turtle.prototype.rt
 * @param distance
 */
Turtle.prototype.rt = Turtle.prototype.right;
/**
 * Alias of [background]{@linkcode Turtle#background}
 * @function Turtle.prototype.bg
 * @param distance
 */
Turtle.prototype.bg = Turtle.prototype.background;
/**
 * Alias of [show]{@linkcode Turtle#show}
 * @function Turtle.prototype.st
 * @param distance
 */
Turtle.prototype.st = Turtle.prototype.show;
/**
 * Alias of [hide]{@linkcode Turtle#hide}
 * @function Turtle.prototype.ht
 * @param distance
 */
Turtle.prototype.ht = Turtle.prototype.hide;
/**
 * Alias of [penUp]{@linkcode Turtle#penUp}
 * @function Turtle.prototype.pu
 * @param distance
 */
Turtle.prototype.pu = Turtle.prototype.penUp;
/**
 * Alias of [penDown]{@linkcode Turtle#penDown}
 * @function Turtle.prototype.pd
 * @param distance
 */
Turtle.prototype.pd = Turtle.prototype.penDown;

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
