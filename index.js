function Site(space, canvas) {
    var that = this;
    this.elements = {
        chat: $('#chat'),
        chatBody: $('#chat-body'),
        chatInput: $('#chat-input'),
        toggleChat: $('#toggle-chat'),
        chatBodyInputContainer: $('#chat-body-input-container'),
        pixelCount: $('#pixel-count'),
        loading: $('#loading'),
        userCount: $('#user-count'),
        palette: $('#palette'),
        grid: $('#grid'),
        toggleGrid: $('#toggle-grid'),
        infoButton: $('#info-button'),
        createScreen: $('#create'),
        createSpace: $('#create-button'),
        createInputName: $('#create-input-name'),
        createInputWidth: $('#create-input-width'),
        createInputHeight: $('#create-input-height'),
        createNew: $('#create-new-space'),
        createExitButton: $('#create-exit-button'),
        browseSpaces: $('#browse-spaces'),
        browseSpacesButton: $('#browse-spaces-button'),
        browseSpacesContent: $('#browse-spaces-content'),
        browseSpacesExitButton: $('#browse-spaces-exit-button')
    };
    this.data = {};
    this.data.render = function () {
        for (var item in this.data) {
            if (item == null)
                return;
            var x = Math.floor(item % that.width);
            var y = Math.floor(item / that.width);
            var pixel = new that.Pixel(x, y, that.data[item], 5);
            pixel.display();
        }
    };
    this.canvas = canvas;
    this.canvas.ctx = this.canvas.getContext('2d');
    this.timer = $('#timer');
    this.space = space;
    this.space.child('height').once('value').then((snapshot) => {
        var value = snapshot.val();
        that.height = value;
        that.canvas.height = that.height * 5;
    });
    this.space.child('width').once('value').then((snapshot) => {
        var value = snapshot.val();
        that.width = value;
        that.canvas.width = that.width * 5;
        that.canvas.ctx.fillStyle = 'white';
        that.canvas.ctx.fillRect(0, 0, that.width * 5, that.height * 5);
        that.elements.grid.css({
            width: that.width * 5 + 'px',
            height: that.height * 5 + 'px'
        });
        that.space.child('data').on('child_added', function (snapshot) {
            var value = snapshot.val();
            var index = Number(snapshot.key);
            that.data[index] = value;
            that.data.render = function () {
                for (var item in that.data) {
                    if (item == null)
                        return;
                    var x = Math.floor(item % that.width);
                    var y = Math.floor(item / that.width);
                    var pixel = new that.Pixel(x, y, that.data[item], 5);
                    pixel.display();
                }
            };
            var x = Math.floor(index % that.width);
            var y = Math.floor(index / that.width);
            var pixel = new that.Pixel(x, y, value, 5);
            pixel.display();
            that.pixelCount++;
            if (that.width != undefined && that.height != undefined)
                that.elements.pixelCount.text(that.pixelCount + ' pixels filled (' + (that.pixelCount / (that.width * that.height) * 100).toFixed(3) + '% of map)');
        });

        that.space.child('data').on('child_changed', function (snapshot) {
            var value = snapshot.val();
            var index = Number(snapshot.key);
            that.data[index] = value;
            that.data.render = function () {
                for (var item in that.data) {
                    if (item == null)
                        return;
                    var x = Math.floor(item % that.width);
                    var y = Math.floor(item / that.width);
                    var pixel = new that.Pixel(x, y, that.data[item], 5);
                    pixel.display();
                }
            };
            var x = Math.floor(index % that.width);
            var y = Math.floor(index / that.width);
            var pixel = new that.Pixel(x, y, value, 5);
            pixel.display();
        });
    });
    this.Pixel = function (x, y, color, size) {
        this.x = x * size;
        this.y = y * size;
        this.color = color;
        this.size = size;
        this.display = function () {
            if (this.color != 'gold') {
                that.canvas.ctx.fillStyle = color;
                that.canvas.ctx.fillRect(this.x, this.y, this.size, this.size);
            } else {
                var image = new Image();
                image.src = 'gold-pixel.png';
                that.canvas.ctx.drawImage(image, this.x, this.y, this.size, this.size);
            }
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
        chungusgray: '#604D53',
        darkgray: '#333333',
        gray: '#c2c2c2',
        white: 'rgb(255,255,255)',
        red: 'rgb(244,67,54)',
        orange: 'rgb(255,152,0)',
        orangeyellow: 'rgb(255, 187, 51)',
        yellow: 'rgb(255,235,59)',
        ivy: '#1de9b6',
        mint: '#00e676',
        lightgreen: 'rgb(25, 255, 25)',
        green: 'rgb(76,175,80)',
        darkgreen: 'rgb(0, 51, 0)',
        blue: 'rgb(33,150,243)',
        indigo: 'rgb(63,81,181)',
        purple: 'rgb(156,39,176)',
        pink: '#ff80ab',
        brown: 'rgb(160,82,45)',
        ogbrown: '#795548',
        peach: 'rgb(255, 203, 164)',
        maroon: 'rgb(128, 0, 0)',
        gold: 'gold'
    };

    this.selectedColor = this.colors.black;

    $('.palette-color').each(function () {
        this.style.background = that.colors[this.id];
        $(this).click(function () {
            that.selectedColor = that.colors[this.id];
            $(this).addClass('selected');
            var thes = this;
            setTimeout(function () {
                $('.palette-color.selected').not(thes).removeClass('selected');
            }, 300);
        });
    });

    this.canvas.onclick = function (e) {
        if (that.canvas.classList.contains('disss')) {
            return;
        } else if (auth.currentUser == null) {
            that.elements.loading.html('');
            var el = document.createElement('p');
            el.innerText = 'Sign in to 2K inc!';
            el.addEventListener('click', function () {
                auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
            });
            that.elements.loading.append(el);
            that.elements.loading.show();
        }
        var x = Math.floor((e.clientX + document.querySelector('#canvas-container').scrollLeft) / 5);
        var y = Math.floor((e.clientY + document.querySelector('#canvas-container').scrollTop) / 5);
        var index = Math.floor(y * that.width) + x;
        var pixel = new that.Pixel(x, y, that.selectedColor, 5);
        that.space.child('data/' + index).set(pixel.color);
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
    };

    this.elements.createSpace.click(function () {
        that.elements.createScreen.show();
    });

    this.elements.createNew.click(function () {
        var name = that.elements.createInputName.val();
        if (name == '')
            name = 'Untitled Space';
        var params = {
            name: name,
            width: that.elements.createInputWidth.val(),
            height: that.elements.createInputHeight.val()
        };
        var space = new Space(params.width, params.height, params.name);
        that.elements.createScreen.hide();
        that = new Site(space.ref, document.querySelector('#main-canvas'));
    });

    this.elements.browseSpacesButton.click(function () {
        that.elements.browseSpaces.show();
    });

    this.elements.createExitButton.click(function () {
        that.elements.createScreen.hide();
    });

    this.elements.browseSpacesExitButton.click(function () {
        that.elements.browseSpaces.hide();
    });

    this.pixelCount = 0;

    this.pushMessage = function () {
        if (this.elements.chatInput.val() != '' && auth.currentUser != null) {
            var d = new Date();
            var chat = {
                message: that.elements.chatInput.val(),
                user: auth.currentUser.uid,
                time: d.toLocaleTimeString() + ' ' + d.toLocaleDateString()
            };
            chatdatabaseref.push().set(chat);
            that.elements.chatInput.val('');
            that.elements.chatInput.trigger('submit');
        } else if (auth.currentUser == undefined) {
            alert('Sign in to 2K inc. to chat!');
        }
    };
    this.displayMessage = function (m) {
        var p = document.createElement('p');
        p.innerText = m.message;
        p.className = 'message-body enlargable';
        var messageinfo = document.createElement('span');
        var user = {
            displayName: 'Unknown'
        };
        database.ref('users/' + m.user).once('value').then(function (snap) {
            user = snap.val();
            var span = document.createElement('span');
            span.innerText = user.displayName;
            span.className = 'chat-username';
            if (user.traits != undefined || user.traits != null) {
                for (var trait in user.traits) {
                    if (user.traits[trait]) {
                        var s = document.createElement('span');
                        s.className = 'trait ' + '_' + trait;
                        span.appendChild(s);
                    }
                }
                if (user.traits['2kinc']) {
                    p.classList.add('k-rainbow');
                }
            }
            var span2 = document.createElement('span');
            span2.innerText = ' at ' + m.time;
            span2.style.display = 'none';
            messageinfo.appendChild(span);
            messageinfo.appendChild(span2);
        }).catch(function (err) {
            console.log(err);
        });
        messageinfo.className = 'message-info';
        var wrapper = document.createElement('div');
        wrapper.className = 'message';
        wrapper.appendChild(p);
        wrapper.appendChild(messageinfo);
        this.elements.chatBody.prepend(wrapper);
    };

    document.onkeypress = function (e) {
        var key = e.key.toLowerCase();
        e.enabled = true;
        if (key === '.' && e.enabled) {
            e.enabled = false;
            var index = $('.palette-color').index(document.querySelector('.palette-color.selected'));
            var next = $('.palette-color')[index + 1];
            var left = that.elements.palette[0].scrollLeft;
            that.elements.palette.scrollLeft(left + 90);
            that.selectedColor = that.colors[next.id];
            $(next).addClass('selected');
            setTimeout(function () {
                $('.palette-color.selected').not(next).removeClass('selected');
                e.enabled = true;
            }, 300);
            console.log('hit');
        }
        if (key === ',' && e.enabled) {
            e.enabled = false;
            var index = $('.palette-color').index(document.querySelector('.palette-color.selected'));
            var next = $('.palette-color')[index - 1];
            var left = that.elements.palette[0].scrollLeft;
            that.elements.palette.scrollLeft(left - 90);
            that.selectedColor = that.colors[next.id];
            $(next).addClass('selected');
            if (timeout != undefined) {
                clearTimeout(timeout);
            }
            var timeout = setTimeout(function () {
                $('.palette-color.selected').not(next).removeClass('selected');
                e.enabled = true;
            }, 300);
            console.log('hit');
        }
    }
}

var app = firebase;
var database = firebase.database();
var databaseref = database.ref('space').child('main');
var chatdatabaseref = database.ref('chat');
var auth = app.auth();

function Space(width, height, name) {
    var that = this;
    this.ref = database.ref('space').push();
    this.id;
    this.ref.on('value', function (snap) {
        that.id = snap.key;
    });
    this.ref.child('width').set(width);
    this.ref.child('height').set(height);
    this.ref.child('name').set(name);
}

database.ref('space').on('child_added', function (snap) {
    var space = snap.val();
    var div = document.createElement('div');
    div.className = 'browse-spaces-item k-button';
    div.innerText = space.name + ' (' + space.width + '×' + space.height + ')';
    div.addEventListener('click', function () {
        site.elements.browseSpaces.hide();
        site = new Site(snap.ref, document.querySelector('#main-canvas'));
    });
    site.elements.browseSpacesContent.prepend(document.createElement('br'));
    site.elements.browseSpacesContent.prepend(div);
});

var site = new Site(databaseref, document.querySelector('#main-canvas'));

databaseref.child('data').limitToLast(1).on('value', function () {
    if (site.elements.loading.text() != 'Sign in to 2K inc!')
        site.elements.loading.hide();
});

chatdatabaseref.on('child_added', (snapshot) => {
    site.displayMessage(snapshot.val());
});

site.elements.chatInput.keyup(function (e) {
    var key = e.key.toLowerCase();
    if (key === "enter") {
        site.pushMessage();
    }
});

site.elements.toggleChat.click(function () {
    site.elements.chat.toggleClass('hidden');
});

site.elements.toggleGrid.click(function () {
    site.elements.grid.toggleClass('hidden');
})

site.elements.pixelCount.on({
    mouseover: function () {
        site.elements.pixelCount.toggleClass('left-side');
        site.elements.userCount.toggleClass('left-side');
    }
});

site.elements.userCount.on({
    mouseover: function () {
        site.elements.pixelCount.toggleClass('left-side');
        site.elements.userCount.toggleClass('left-side');
    }
});

auth.onAuthStateChanged(function (user) {
    if (user) {
        var ref = database.ref('users/' + user.uid);
        ref.child('displayName').set(user.displayName);
        ref.child('photoURL').set(user.photoURL);
        if (site.elements.loading.text() == 'Sign in to 2K inc!')
            site.elements.loading.hide();
        database.ref('users/' + auth.currentUser.uid + '/banned').once('value').then(function (snap) {
            var banned = snap.val();
            if (banned == true) {
                document.body.innerHTML = "Oof. Feels bad. You've been banned from 2K space.";
            }
        });
    } else {
        site.elements.loading.html('');
        var el = document.createElement('p');
        el.innerText = 'Sign in to 2K inc!';
        el.addEventListener('click', function () {
            auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        });
        site.elements.loading.append(el);
        site.elements.loading.show();
    }
});

var listRef = database.ref('onlineusers');
var userRef = listRef.push();

// Add ourselves to presence list when online.
var presenceRef = database.ref(".info/connected");
presenceRef.on("value", function (snap) {
    if (snap.val()) {
        // Remove ourselves when we disconnect.
        userRef.onDisconnect().remove();

        userRef.set(true);
    }
});

// Number of online users is the number of objects in the presence list.
listRef.on("value", function (snap) {
    site.elements.userCount.text(snap.numChildren() + ' online');
});

console.log("%c2K inc. %cWant to become a 2K inc developer? Do not worry, CHILD. Fork one of our repositories on Github and we'll hit you up.", 'font-size: 4em; font-family: neue-haas-unica, sans-serif;', 'font-size: 1em; color: green;');

$(document).on('mousemove', function (e) {
    if (e.clientY < 60) {
        $('#navbar').removeClass('hidden');
    } else {
        $('#navbar').addClass('hidden');
    }
});