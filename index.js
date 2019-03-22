function Site(space, canvas) {
    var that = this;
    var firebasedata;
    this.canvas = canvas;
    this.canvas.ctx = this.canvas.getContext('2d');
    space.once('value').then(()=>(snapshot) {
        firebasedata = snapshot.val();
        that.width = firebasedata.width;
        that.height = firebasedata.height;
        that.canvas.width = that.width * 5;
        that.canvas.height = that.height * 5;
        that.data = firebasedata.data;
        that.data.render = function() {
            for (var item in that.data) {
                if (item == null)
                    return;
                var x = Math.floor(item % that.width) + 1;
                var y = Math.floor(item / that.width) + 1;
                var pixel = new that.Pixel(x, y, that.data[item], 5);
                pixel.display();
            }
        };
        that.data.render();
    });
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
    this.getDataKey = (x, y) => {
        return x + ', ' + y;
    };
    this.getCoordinatesFromDataKey = (key) => {
        var a = key.split(', ');
        return {
            x: Number(a[0]),
            y: Number(a[1])
        };
    };

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
        if(this.canvas.classList.contains('disss')){return}
        var x = Math.floor(e.clientX / 5) - 1;
        var y = Math.floor(e.clientY / 5) - 1;
        var index = Math.floor(y * that.width) + x;
        var pixel = new that.Pixel(x, y, that.selectedColor, 5);
        that.data[index] = pixel.color;
        that.data.render();
        databaseref.child('data').set(JSON.parse(JSON.stringify(that.data)));
        this.canvas.classList.add('disss');
        setTimeout(()=>{this.canvas.classList.remove('disss')},30000)
    });

}

var app = firebase;
var database = firebase.database();
var databaseref = database.ref('space').child('main');
var auth = app.auth();

var site = new Site(databaseref, document.querySelector('#main-canvas'));

databaseref.on('child_changed', (snapshot) => {
    var value = snapshot.val();
    site.data = value;
    site.data.render = function() {
        for (var item in site.data) {
            if (item == null)
                return;
            var x = Math.floor(item % site.width) + 1;
            var y = Math.floor(item / site.width) + 1;
            var pixel = new site.Pixel(x, y, site.data[item], 5);
            pixel.display();
        }
    };
    site.data.render();
});
