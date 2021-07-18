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

var blokCounter: number = 0;
var linkCounter: number = 0;



///////////////////////////////
// Adding and editing blocks //
///////////////////////////////
function addBlock(x: number, y: number, type: EBlokType){
  
  blokCounter++;
  let blokId = 'blok'+blokCounter;

  let blokWidth = blockAttrs[type].width;
  let blokHeight = blockAttrs[type].height;

  // block group
  let frontendBlok = new Konva.Group({
    draggable: true,
    id: blokId
  })
  frontendBlok.on('dragmove', function() { updateLinkPos(this.id()); });

  // backend object
  let backendBlock = blockFactory(type)

  // Create frontend to backend mapping
  blokPile.push(
    {
      frontendId: blokId, 
      backendObject: backendBlock,
      inputRefs: [],
      outputRef: {} as canvasBlok
    }
  )

  // background box
  let box = new Konva.Rect({
    x: x,
    y: y,
    width: blokWidth,
    height: blokHeight,
    fill: 'black',
    stroke: 'black',
    strokeWidth: 4,
    cornerRadius: 10,
    id: blokId + '-bg'
  });
  box.on('mouseover', function () {
    document.body.style.cursor = 'pointer';
  });
  box.on('mouseout', function () {
    document.body.style.cursor = 'default';
  });
  frontendBlok.add(box)

  // text
  let text = new Konva.Text({
    x: x+blokWidth/2,
    y: y+blokHeight/2,
    text: blockAttrs[type].title,
    fontSize: 24,
    fontFamily: 'Calibri',
    fill: 'white',
    id: blokId + '-text'
  });
  text.offsetX(text.width() / 2);
  text.offsetY(text.height() / 2);
  frontendBlok.add(text);

  // inputs
  let inputKeys = backendBlock.inputs.map(input => input.inputKey);
  let blockInputs = new Konva.Group()
  inputKeys.forEach((inputKey, index) => {
    let circle = new Konva.Circle({
      x: x,
      y: y + blokHeight/2 + 25*index,
      radius: 10,
      fill: 'red',
      id: blokId + '-input/'+inputKey
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
  frontendBlok.add(blockInputs)

  // output
  let circle = new Konva.Circle({
    x: x+blokWidth,
    y: y+blokHeight/2,
    radius: 10,
    fill: 'blue',
    id: blokId + '-output'
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
  frontendBlok.add(circle);

  layer.add(frontendBlok);
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
