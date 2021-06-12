import variableBock from './variableBlock';

// this is where the program is declared as a bunch of linked block classes
var firstBlock = new variableBock({x: 0, y: 0});
console.log(firstBlock.run);