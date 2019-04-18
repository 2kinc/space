var scale = 1;
var left = 0;
var topPosition = 0;
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;

function update() {
    $('#canvas-resizer').css({
        transform: 'scale(' + scale + ')'
    });
    $('#canvas-mover').css({
        transform: 'translate(' + left + 'px, ' + topPosition + 'px)'
    });
}

document.body.onkeypress = function (e) {
    var key = e.key.toLowerCase();
    if (key === 'q') {
        scale *= 1.1;
        update();
    } else if (key === 'e') {
        scale *= 0.8;
        update();
    } else if (key === 'w') {
        topPosition += 40;
        update();
    } else if (key === 'a') {
        left += 40;
        update();
    } else if (key === 's') {
        topPosition -= 40;
        update();
    } else if (key === 'd') {
        left -= 40;
        update();
    }
};