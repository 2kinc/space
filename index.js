function Site(w, h, canvas) {
    var that = this;
    this.width = w;
    this.height = h;
    this.canvas = canvas;
    this.canvas.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.width * 5;
    this.canvas.height = this.height * 5;
    this.Pixel = function(x, y, color, size) {
        this.x = x * size;
        this.y = y * size;
        this.color = color;
        this.size = size;
        this.display = function() {
            that.canvas.ctx.fillStyle = color;
            that.canvas.ctx.fillRect(this.x, this.y, this.size, this.size);
        };
    };
    this.getDataKey = function(x, y) {
        return x + ', ' + y;
    };
    this.getCoordinatesFromDataKey = function(key) {
        var a = key.split(', ');
        return {
            x: Number(a[0]),
            y: Number(a[1])
        };
    };
    this.data = JSON.parse(window.localStorage.getItem('data')) || [];
    this.data.render = function() {
        that.data.forEach(function(item, index) {
            if (item == null)
                return;
            var x = Math.floor(index % that.width) + 1;
            var y = Math.floor(index / that.width) + 1;
            var pixel = new that.Pixel(x, y, item, 5);
            pixel.display();
        });
    }

    this.colors = {
        black: 'rgb(0,0,0)',
        white: 'rgb(255,255,255)',
        red: 'rgb(244,67,54)',
        orange: 'rgb(255,152,0)',
        yellow: 'rgb(255,235,59)',
        green: 'rgb(76,175,80)',
        blue: 'rgb(33,150,243)',
        purple: 'rgb(156,39,176)',
        pink: 'rgb(233,30,99)'
    };

    this.selectedColor = this.colors.black;

    $('.palette-color').each(function() {
        this.style.background = that.colors[this.id];
        $(this).click(function() {
            that.selectedColor = that.colors[this.id];
            $('.palette-color').each(function() {
                $(this).removeClass('palette-color-selected');
            });
            $(this).toggleClass('palette-color-selected');
        });
    });

    this.canvas.addEventListener('click', function(e) {
        var x = Math.floor(e.clientX / 5);
        var y = Math.floor(e.clientY / 5);
        var index = Math.floor((y - 1) * that.width) + x;
        var pixel = new that.Pixel(x, y, that.selectedColor, 5);
        that.data[index] = pixel.color;
        that.data.render();
        window.localStorage.setItem('data', JSON.stringify(that.data));
    });

    this.data.render();
}

var site = new Site(window.innerWidth / 5, window.innerHeight / 5, document.querySelector('#main-canvas'));

var app = firebase;
var database = firebase.database();
var databaseref = database.ref('space').child('main');
