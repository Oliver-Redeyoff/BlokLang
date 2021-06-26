import Konva from 'konva';
import { test } from './main.js';

function testBlock() {
    var res = test()
    var resultRef = document.getElementById('result');
    if(resultRef!=null){
        resultRef.innerHTML = res.toString();
    }
}
testBlock()

var stageWidth = 100;
var stageHeight = 100;
var stage = new Konva.Stage({
  container: 'block-canvas',
  width: stageWidth,
  height: stageHeight,
});

function fitStageIntoParentContainer() {
  var container = document.getElementById('block-canvas');

  var containerWidth = container.offsetWidth;
  var containerHeight = container.offsetHeight;

  var scaleWidth = containerWidth / stageWidth;
  var scaleHeight = containerHeight / stageHeight;

  stage.width(stageWidth * scaleWidth);
  stage.height(stageHeight * scaleHeight);
}
window.addEventListener('resize', fitStageIntoParentContainer);
fitStageIntoParentContainer();

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

window.allowDrop = function(ev) {
  ev.preventDefault();
}

window.drag = function(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

window.drop = function(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  console.log(data);
}