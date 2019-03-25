function Site(space, canvas) {
    var that = this;
    var firebasedata;
    this.elements = {
        chat: $('#chat'),
        chatBody: $('#chat-body'),
        chatInput: $('#chat-input'),
        hideChat: $('#hide-chat'),
        chatBodyInputContainer: $('#chat-body-input-container')
    };
    this.canvas = canvas;
    this.canvas.ctx = this.canvas.getContext('2d');
    this.timer = $('#timer');
    space.once('value').then((snapshot) => {
        firebasedata = snapshot.val();
        that.width = firebasedata.width;
        that.height = firebasedata.height;
        that.canvas.width = that.width * 5;
        that.canvas.height = that.height * 5;
        this.canvas.ctx.fillStyle = 'white';
        that.canvas.ctx.fillRect(0, 0, that.height * 5, that.height * 5);
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
        that.startTime = new Date().getTime();
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
        gray: '#c2c2c2',
        white: 'rgb(255,255,255)',
        red: 'rgb(244,67,54)',
        orange: 'rgb(255,152,0)',
        yellow: 'rgb(255,235,59)',
        mint: '#00e676',
        green: 'rgb(76,175,80)',
        blue: 'rgb(33,150,243)',
        indigo: 'rgb(63,81,181)',
        purple: 'rgb(156,39,176)',
        pink: '#ff80ab',
        hotpink: 'rgb(233,30,99)',
        peach: 'rgb(255, 203, 164)',
        brown: 'rgb(121,85,72)'
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
        if (that.canvas.classList.contains('disss')) {
            return
        }
        var x = Math.floor((e.clientX + document.querySelector('#canvas-container').scrollLeft) / 5) - 1;
        var y = Math.floor((e.clientY + document.querySelector('#canvas-container').scrollTop) / 5) - 1;
        var index = Math.floor(y * that.width) + x;
        var pixel = new that.Pixel(x, y, that.selectedColor, 5);
        databaseref.child('data/' + index).set(pixel.color);
        /*that.canvas.classList.add('disss');
        that.timer.show();
        var count = 15;
        var interval = setInterval(function () {
            if (count <= 0){
                that.timer.text(15);
                clearInterval(interval);
            }
            that.timer.text(count);
            count--;
        }, 1000);
        setTimeout(()=>{
            that.canvas.classList.remove('disss');
            that.timer.hide();
        },15000);*/ //timer will be put back later
    });
}

var app = firebase;
var database = firebase.database();
var databaseref = database.ref('space').child('main');
var chatdatabaseref = database.ref('chat');
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

chatdatabaseref.on('child_added', (snapshot) => {
    var value = snapshot.val();
    var p = document.createElement('p');
    p.innerText = value.name + ': ' + value.message;
    site.elements.chatBody.prepend(p);
})

site.elements.chatInput.keyup(function(e) {
    var key = e.key.toLowerCase();
    if (key === "enter" && site.elements.chatInput.val() != '' && auth.currentUser != null) {
        var d = new Date();
        var chat = {
            message: site.elements.chatInput.val(),
            profilePicture: auth.currentUser.photoURL,
            name: auth.currentUser.displayName,
            time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        };
        chatdatabaseref.push().set(chat);
        site.elements.chatInput.val('');
    } else if (auth.currentUser == null && key === "enter") {
        alert('Sign in to 2K inc. to chat!');
    }
});

site.elements.hideChat.text('HIDE CHAT');

site.elements.hideChat.click(function () {
    site.elements.chat.toggleClass('hidden');
    if (site.elements.hideChat.text() == 'HIDE CHAT')
        site.elements.hideChat.text('SHOW CHAT');
    else
        site.elements.hideChat.text('HIDE CHAT');
});
