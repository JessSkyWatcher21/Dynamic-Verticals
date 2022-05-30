// my scripts
console.log('Loaded')
// just JS 

//add two.js
import Two from 'https://cdn.skypack.dev/two.js@latest';
var two = new Two({
  type: Two.Types.svg,
  fullscreen: true,
  autostart: true
}).appendTo(document.body);
createGrid();
//ink
var x, y, line, mouse = new Two.Vector(), randomness = 0;
window.addEventListener('mousedown', function(e) {
  mouse.set(e.clientX, e.clientY);
  line = null;
  window.addEventListener('mousemove', drag, false);
  window.addEventListener('mouseup', dragEnd, false);
}, false);
window.addEventListener('touchstart', function(e) {
  e.preventDefault();
  var touch = e.originalEvent.changedTouches[0];
  mouse.set(touch.pageX, touch.pageY);
  line = null;
  window.addEventListener('touchmove', touchDrag, false);
  window.addEventListener('touchend', touchEnd, false);
  return false;
}, false);

//clean slate
two.bind('update', update);

//ink functions
function drag(e) {
  x = e.clientX;
  y = e.clientY;
  if (!line) {
    var v1 = makePoint(mouse);
    var v2 = makePoint(x, y);
    line = two.makeCurve([v1, v2], true);
    line.noFill().stroke = '#800080';
    line.linewidth = 20;
    line.vertices.forEach(function(v) {
      v.addSelf(line.translation);
    });
    line.translation.clear();
  } else {
    var v1 = makePoint(x, y);
    line.vertices.push(v1);
  }
  mouse.set(x, y);
} 
function dragEnd(e) {
  window.removeEventListener('mousemove', drag, false);
  window.removeEventListener('mouseup', dragEnd, false);
}
function touchDrag(e) {
  e.preventDefault();
  var touch = e.changedTouches[0];
  drag({
    clientX: touch.pageX,
    clientY: touch.pageY
  });
  return false;
};
function touchEnd(e) {
  e.preventDefault();
  window.removeEventListener('touchmove', touchDrag, false);
  window.removeEventListener('touchend', touchEnd, false);
  return false;
}
function update(frameCount, timeDelta) {
  for (var i = 0; i < two.scene.children.length; i++) {
    var child = two.scene.children[i];
    for (var j = 0; j < child.vertices.length; j++) {
      var v = child.vertices[j];
      if (!v.position) {
        return;
      }
      v.x = v.position.x + (Math.random() * randomness - randomness / 2);
      v.y = v.position.y + (Math.random() * randomness - randomness / 2);
    }
  }
}
function makePoint(x, y) {

  if (arguments.length <= 1) {
    y = x.y;
    x = x.x;
  }

  var v = new Two.Anchor(x, y);
  v.position = new Two.Vector().copy(v);

  return v;

}

//grid
function createGrid(s) {

  var size = s || 40;
  var two = new Two({
    type: Two.Types.canvas,
    width: size,
    height: size
  });

  var a = two.makeLine(two.width / 2, 0, two.width / 2, two.height);
  var b = two.makeLine(0, two.height / 2, two.width, two.height / 2);
  a.stroke = b.stroke = '#ff781f';

  two.update();

  var imageData = two.renderer.domElement.toDataURL('image/png');
  document.body.style.backgroundImage = `url(${imageData})`;
}