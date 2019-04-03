var scale = 1;
var left = 0;
var topPosition = 0;
var x = 0;
var y = 0;
var mouseX = 0;
var mouseY = 0;

document.body.onkeypress = function (e) {
    var key = e.key.toLowerCase();
    if (key === 'q') {
        scale *= 1.1;
        site.canvas.style.transformOrigin = x + 'px ' + y + 'px';
        site.canvas.style.transform = 'scale(' + scale + ')';
        x = (mouseX * scale + left);
        y = (mouseY * scale + topPosition);
    } else if (key === 'e') {
        scale *= 0.8;
        site.canvas.style.transformOrigin = x + 'px ' + y + 'px';
        site.canvas.style.transform = 'scale(' + scale + ')';
        x = (mouseX * scale + left);
        y = (mouseY * scale + topPosition);
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

document.body.onmousemove = function (e) {
    x = (e.clientX * scale + left);
    y = (e.clientY * scale + topPosition);
    mouseX = e.clientX;
    mouseY = e.clientY;
}