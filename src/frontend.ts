import Konva from 'konva';
import { runBlokPile, blokFactory } from './backend.js';
import { EBlokType, blokLink, blok } from './types.js';

var blokPile: blok[] = [];
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



///////////////////////////////
// Adding and editing blocks //
///////////////////////////////

function addBlock(x: number, y: number, type: EBlokType){

  let backendBlock = blokFactory(type);
  let frontendBlok = backendBlock.renderBlok(x, y, blokOutputClickHandler, blokInputClickHandler, blokDragHandler);

  blokPile.push(
      {
        frontendId: frontendBlok.id(),
        backendObject: backendBlock,
        inputRefs: [],
        outputRef: {} as blok
      }
  )

  layer.add(frontendBlok);
}

function blokOutputClickHandler(outputFId: string) {
  linkBuffer.originFrontendId = outputFId;
  linkBuffer.destinationFrontendId = "";
}
function blokInputClickHandler(inputFId: string) {
  if(linkBuffer.originFrontendId != "") {
    linkBuffer.destinationFrontendId = inputFId;
    createLinkWithBuffer();
  }
}
function blokDragHandler(subjectId: string) {
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

var linkCounter: number = 0;
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
