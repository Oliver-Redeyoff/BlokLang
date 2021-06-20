import { test } from './build/main.js';

var canvasSize = {
    width: 0,
    height: 0
}

function testBlock() {
    var res = test()
    console.log(res)
    var resultRef = document.getElementById('result');
    if(resultRef!=null){
        resultRef.innerHTML = res.toString();
    }
}
testBlock()


var stage = new Konva.Stage({
  container: 'block-canvas',
  width: window.innerWidth,
  height: window.innerHeight,
});

// add canvas element
var layer = new Konva.Layer();
stage.add(layer);

// create shape
var box = new Konva.Rect({
  x: 50,
  y: 50,
  width: 100,
  height: 50,
  fill: '#00D2FF',
  stroke: 'black',
  strokeWidth: 4,
  draggable: true,
});
layer.add(box);

// add cursor styling
box.on('mouseover', function () {
  document.body.style.cursor = 'pointer';
});
box.on('mouseout', function () {
  document.body.style.cursor = 'default';
});