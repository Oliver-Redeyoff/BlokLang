import Konva from 'konva';
import { test } from './main.js';

var EBlockTypes = {
  'variable-block': {
    title: 'Value',
    width: 100,
    height: 100
  },
  'evaluate-block': {
    title: 'Evaluate',
    width: 200,
    height: 150
  }
}

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
  if(container == null) return;

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

function addBlock(x: number, y: number, type: keyof typeof EBlockTypes){

  let blockWidth = EBlockTypes[type].width;
  let blockHeight = EBlockTypes[type].height;

  // block group
  var group = new Konva.Group({
    draggable: true
  })

  // background box
  var box = new Konva.Rect({
    x: x,
    y: y,
    width: blockWidth,
    height: blockHeight,
    fill: 'black',
    stroke: 'black',
    strokeWidth: 4,
    cornerRadius: 10
  });
  box.on('mouseover', function () {
    document.body.style.cursor = 'pointer';
  });
  box.on('mouseout', function () {
    document.body.style.cursor = 'default';
  });
  group.add(box)

  // text
  var text = new Konva.Text({
    x: x+blockWidth/2,
    y: y+blockHeight/2,
    text: EBlockTypes[type].title,
    fontSize: 24,
    fontFamily: 'Calibri',
    fill: 'white',
  });
  text.offsetX(text.width() / 2);
  text.offsetY(text.height() / 2);
  group.add(text);

  var circle = new Konva.Circle({
    x: x+blockWidth,
    y: y+blockHeight/2,
    radius: 10,
    fill: 'red',
  });
  circle.on('mouseover', function () {
    this.fill('green')
  });
  circle.on('mouseout', function () {
    this.fill('red')
  });
  group.add(circle);

  layer.add(group);
}

declare global {
  interface Window {
    allowDrop: Function;
    drag: Function;
    drop: Function;
  }
}
window.allowDrop = function(ev: any) {
  ev.preventDefault();
}

window.drag = function(ev: any) {
  ev.dataTransfer.setData("blockType", ev.target.id);
}

window.drop = function(ev: any) {
  var blockType = ev.dataTransfer.getData("blockType");
  addBlock(ev.offsetX, ev.offsetY, blockType);
  ev.preventDefault();
}