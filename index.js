function Site(w, h, canvas) {
    var that = this;
    this.width = w;
    this.height = h;
    this.canvas = canvas;
    this.canvas.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.Pixel = function (x, y, color, size) {
        this.x = x * size;
        this.y = y * size;
        this.color = color;
        this.size = size;
        this.display = function () {
            that.canvas.ctx.fillStyle = color;
            that.canvas.ctx.fillRect(this.x, this.y, this.size, this.size);
        };
    };
    this.getDataKey = function (x, y) {
        return x + ', ' + y;
    };
    this.getCoordinatesFromDataKey = function (key) {
        var a = key.split(', ');
        return {
            x: Number(a[0]),
            y: Number(a[1])
        };
    };
    this.data = new Map();
    this.data.render = function () {
        that.data.forEach(function (item, key) {
            var c = that.getCoordinatesFromDataKey(key);
            var pixel = new that.Pixel(c.x, c.y, item, 5);
            pixel.display();
        });
    }

    this.canvas.addEventListener('click', function (e) {
        var x = Math.floor(e.clientX / 5);
        var y = Math.floor(e.clientY / 5);
        var pixel = new that.Pixel(x, y, 'black', 5);
        that.data.set(that.getDataKey(x, y), 'black');
        that.data.render();
    });
}

var site = new Site(window.innerWidth, window.innerHeight, document.querySelector('#main-canvas'));