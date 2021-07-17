import Konva from 'konva';
import { runBlokPile, blockFactory } from './backend.js';
import { EBlokType, blokLink, canvasBlok } from './types.js';

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

var blokPile: canvasBlok[] = [];
var blokLinks: blokLink[] = [];
var linkBuffer: blokLink = {lineFrontendId: "", originFrontendId: "", destinationFrontendId: ""};



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

var blockCounter: number = 0;
var linkCounter: number = 0;



///////////////////////////////
// Adding and editing blocks //
///////////////////////////////
function addBlock(x: number, y: number, type: EBlokType){
  
  blockCounter++;
  let blockId = 'block'+blockCounter;

  let blockWidth = blockAttrs[type].width;
  let blockHeight = blockAttrs[type].height;

  // block group
  let frontendBlock = new Konva.Group({
    draggable: true,
    id: blockId
  })
  frontendBlock.on('dragmove', function() { updateLinkPos(this.id()); });

  // backend object
  let backendBlock = blockFactory(type)

  // Create frontend to backend mapping
  blokPile.push(
    {
      frontendId: blockId, 
      backendObject: backendBlock
    }
  )

  // background box
  let box = new Konva.Rect({
    x: x,
    y: y,
    width: blockWidth,
    height: blockHeight,
    fill: 'black',
    stroke: 'black',
    strokeWidth: 4,
    cornerRadius: 10,
    id: blockId + '-bg'
  });
  box.on('mouseover', function () {
    document.body.style.cursor = 'pointer';
  });
  box.on('mouseout', function () {
    document.body.style.cursor = 'default';
  });
  frontendBlock.add(box)

  // text
  let text = new Konva.Text({
    x: x+blockWidth/2,
    y: y+blockHeight/2,
    text: blockAttrs[type].title,
    fontSize: 24,
    fontFamily: 'Calibri',
    fill: 'white',
    id: blockId + '-text'
  });
  text.offsetX(text.width() / 2);
  text.offsetY(text.height() / 2);
  frontendBlock.add(text);

  // inputs
  let inputKeys = Object.keys(backendBlock.input);
  let blockInputs = new Konva.Group()
  inputKeys.forEach((inputKey, index) => {
    let circle = new Konva.Circle({
      x: x,
      y: y + blockHeight/2 + 25*index,
      radius: 10,
      fill: 'red',
      id: blockId + '-input'+index
    });
    circle.on('mouseover', function () {
      this.fill('green')
    });
    circle.on('mouseout', function () {
      this.fill('red')
    });
    circle.on('click', function() {
      if(linkBuffer.originFrontendId != "") {
        linkBuffer.destinationFrontendId = this.id();
        createLinkWithBuffer();
      } else {
        return;
      }
    })
    blockInputs.add(circle);
  });
  frontendBlock.add(blockInputs)

  // output
  let circle = new Konva.Circle({
    x: x+blockWidth,
    y: y+blockHeight/2,
    radius: 10,
    fill: 'blue',
    id: blockId + '-output'
  });
  circle.on('mouseover', function () {
    this.fill('green')
  });
  circle.on('mouseout', function () {
    this.fill('blue')
  });
  circle.on('click', function() {
    linkBuffer.originFrontendId = this.id();
    linkBuffer.destinationFrontendId = "";
  })
  frontendBlock.add(circle);

  layer.add(frontendBlock);
}

function createLinkWithBuffer() {

  var linkFrontendId = "link" + linkCounter++;

  let outputElement = stage.findOne('#' + linkBuffer.originFrontendId);
  let inputElement = stage.findOne('#' + linkBuffer.destinationFrontendId);

  blokLinks.push({
      lineFrontendId: linkFrontendId,
      originFrontendId: linkBuffer.originFrontendId, 
      destinationFrontendId: linkBuffer.destinationFrontendId
    });

  var linkLine = new Konva.Line({
    points: [
      outputElement.absolutePosition().x, 
      outputElement.absolutePosition().y, 
      inputElement.absolutePosition().x, 
      inputElement.absolutePosition().y
    ],
    stroke: 'green',
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'round',
    id: linkFrontendId
  });

  layer.add(linkLine);

  // reset link buffer
  linkBuffer = {lineFrontendId: "", originFrontendId: "", destinationFrontendId: ""};
}

function updateLinkPos(subjectId: string) {
  blokLinks.forEach((link) => {
    if(link.destinationFrontendId.split('-')[0] == subjectId || link.originFrontendId.split('-')[0] == subjectId) {
      let outputElement = stage.findOne('#' + link.originFrontendId);
      let inputElement = stage.findOne('#' + link.destinationFrontendId);
      let lineElement:any = stage.findOne('#' + link.lineFrontendId);

      lineElement.setPoints([
        outputElement.absolutePosition().x, 
        outputElement.absolutePosition().y, 
        inputElement.absolutePosition().x, 
        inputElement.absolutePosition().y
      ]);
    }
  })
}



/////////////////////////
// Drag and drop logic //
/////////////////////////
declare global {
  interface Window {
    allowDrop: Function;
    drag: Function;
    drop: Function;
    toggleBlokList: Function;
    runBlokPile: Function;
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
  addBlock(ev.offsetX, ev.offsetY, parseInt(blockType));
  ev.preventDefault();
}
window.toggleBlokList = function() {
  let blokListElement = document.getElementById("blok-list");
  blokListElement?.classList.toggle('minimised');
  blokListElement?.classList.toggle('open');
}
window.runBlokPile = function() {
  runBlokPile(blokPile, blokLinks);
}
