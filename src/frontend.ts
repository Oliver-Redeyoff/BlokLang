import Konva from 'konva';
import { test, blockFactory } from './backend.js';
import { EBlocks, FtBMapping } from './types.js';

var blockAttrs = {
  1: {
    title: 'Value',
    width: 100,
    height: 100
  },
  2: {
    title: 'Evaluate',
    width: 200,
    height: 150
  }
}

var FtBMapping: FtBMapping[] = [];

function testBlock() {
    var res = test()
    var resultRef = document.getElementById('result');
    if(resultRef!=null){
        resultRef.innerHTML = res.toString();
    }
}
testBlock()


/////////////////
// Setup Konva //
/////////////////
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

var layer = new Konva.Layer();
stage.add(layer);

function addBlock(x: number, y: number, type: EBlocks){

  let blockWidth = blockAttrs[type].width;
  let blockHeight = blockAttrs[type].height;

  // block group
  var group = new Konva.Group({
    draggable: true
  })

  // Instantiate class and create mapping
  FtBMapping.push({frontendId: group._id, backendObject: blockFactory(type)})

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
    text: blockAttrs[type].title,
    fontSize: 24,
    fontFamily: 'Calibri',
    fill: 'white',
  });
  text.offsetX(text.width() / 2);
  text.offsetY(text.height() / 2);
  group.add(text);

  // inputs
  for(let i=0 ; i<2 ; i++){
    var circle = new Konva.Circle({
      x: x,
      y: y+blockHeight/2 + 25*i,
      radius: 10,
      fill: 'red',
    });
    circle.on('mouseover', function () {
      this.fill('green')
    });
    circle.on('mouseout', function () {
      this.fill('red')
    });
    circle.on('click', function() {
      console.log(layer)
    })
    group.add(circle);
  }

  // outputs
  for(let i=0 ; i<2 ; i++){
    var circle = new Konva.Circle({
      x: x+blockWidth,
      y: y+blockHeight/2 + 25*i,
      radius: 10,
      fill: 'blue',
    });
    circle.on('mouseover', function () {
      this.fill('green')
    });
    circle.on('mouseout', function () {
      this.fill('blue')
    });
    circle.on('click', function() {
      console.log('test')
    })
    group.add(circle);
  }

  layer.add(group);
  console.log(FtBMapping)
}


/////////////////////////
// Drag and drop logic //
/////////////////////////
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