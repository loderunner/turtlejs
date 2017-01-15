const defaultTurtleImageData = 
    'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAACFElEQVRo3u3XTUhUURjG8b96dXJqyKlU' +
    'LIcpLaKvYYohSpBsY4MgVtAQhLRQKAwThspclAvLiaywKLJoRmrRIoQ+kKLCoqAvUMKgSIsRk4IYCGEg' +
    'KHPeFrdNIGFePXdzzrM5HO7l/Bbn3Pe9CPYGDdAADdAADdAADdAADdAAi6874wNDrX0rSGOqwyLAG5F5' +
    'UiM3Pg4f7V8yJYZFgC/yZ5ov+1K33n0++HzRfzIsAvyRvxY8Ek51vx7Zfz9v0ozpBZgplqbxhy9Harvd' +
    'k2DMBMDMKmkee/J4uPq265+M6QGYY6JH1snxHy/uxUNnsm0CIEialEjb996b8cp6hy0AMxmyWc4l+69/' +
    'KC8zbAGYyZSgXBx9GxsoJd0WgBmHbJMricHz7wO2AaqkI9nTdW2LcoAhQWn/eWlwaxeHqMCrEJAuZXJq' +
    'LDoUumO0UEs5qynAqegabpQTv2Kfdt/NamUPQXwsZI6iQ+iXlvHOL3sfzD5JHRX4KcRFhpJP8Uo5kur8' +
    '2vAo5zT1VLIWDy4MJbWgSBpTscThp7ntNFBFAC9zJ9h6JgCFEpbot+ZnnguE2c56FpODoaAYIflSJ9HR' +
    'Y6+KOzjADjZQhJtMJeXYLTVyOdnWtyZKIzspYSnzyVLVkPh6E2ffBK7SxC5KWcYCHGpbMi8hqtnEcnKZ' +
    'ZUdT6qSAPLJta8v1n5EGaIAGaIAGaIAGaID1/AZnyrNXSqkX6AAAAABJRU5ErkJggg==';


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
    const width = this._canvasElement.width;
    const height = this._canvasElement.height;

    ctx.save();

    // Draw background layer
    {
        const bgCtx = this.getBackgroundContext();
        const bgImgData = bgCtx.getImageData(
            0, 
            0,
            width,
            height
        );
        ctx.putImageData(bgImgData, 0, 0);
    }

    // Draw foreground layer
    {
        const fgCtx = this.getForegroundContext();

        // flip y axis and center origin
        fgCtx.transform(1, 0, 0, -1, width/2, height/2);
        const fgImgData = fgCtx.getImageData(
            0,
            0, 
            width,
            height
        );
        ctx.putImageData(fgImgData, 0, 0);
    }

    ctx.restore();
}

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
 * @property {Object} turtleImage - (write-only) The image used to represent the turtle. The
 * type can be any type accepted by CanvasRenderingContext2D.drawImage
 */ 
function Turtle() {
    this._x = 0;
    this._y = 0;
    this._orientation = 0;
    this._turtleImage = Turtle.defaultTurtleImage;
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
Object.defineProperty(Turtle.prototype, 'turtleImage', {
    set: function(i) { this._turtleImage = i; }
});

/**
 * Moves the turtle to an (absolute) position.
 * @param {Number} x - the x coordinate of the target position
 * @param {Number} y - the y coordinate of the target position
 */
 Turtle.prototype.moveTo = function(x, y) {

    if (this._renderer) {
        this._renderer.drawLine(this._x, this._y, x, y);
        this._renderer.render(this);
    }

    this._x = x;
    this._y = y;
 }

 /**
  * Sets the background color.
  * @param {Color} color - the background color
  */
Turtle.prototype.background = function(color) {
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
    turtle._renderer.render(turtle);

    return turtle;
}

window.Turtle = Turtle;
