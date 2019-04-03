var scale = 1;
var left = 0;
var topPosition = 0;
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;
var mouseX = 0;
var mouseY = 0;

document.body.onkeypress = function (e) {
    var key = e.key.toLowerCase();
    if (key === 'q') {
        scale *= 1.1;
        site.canvas.style.transformOrigin = (x - left) + 'px ' + (y - topPosition) + 'px';
        site.canvas.style.transform = 'scale(' + scale + ')';
    } else if (key === 'e') {
        scale *= 0.8;
        y = (mouseY - topPosition);
        site.canvas.style.transformOrigin = (x - left) + 'px ' + (y - topPosition) + 'px';
        site.canvas.style.transform = 'scale(' + scale + ')';
    } else if (key === 'w') {
        topPosition += 40;
        site.canvas.style.top = topPosition + 'px';
    } else if (key === 'a') {
        left += 40;
        site.canvas.style.left = left + 'px';
    } else if (key === 's') {
        topPosition -= 40;
        site.canvas.style.top = topPosition + 'px';
    } else if (key === 'd') {
        left -= 40;
        site.canvas.style.left = left + 'px';
    }
};