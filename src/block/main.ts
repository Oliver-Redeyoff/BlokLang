import variableBock from './variableBlock.js';

// this is where the program is declared as a bunch of linked block classes
export function test() {
    var firstBlock = new variableBock({x: 0, y: 0});
    return firstBlock.run();
}