import variableBock from './variableBlock.js';
import evaluateBlock from './evaluateBlock.js';

// this is where the program is declared as a bunch of linked block classes
export function test() {
    var firstBlock = new variableBock<number>({x: 0, y: 0});
    firstBlock.setProperties({value: 10});
    
    var secondBlock = new variableBock<number>({x: 1, y: 1});
    secondBlock.setProperties({value: 20});

    var thirdBlock = new evaluateBlock({x: 2, y: 2});
    thirdBlock.setProperties({expression: "x + y"})
    return(thirdBlock.run({x: firstBlock.run(), y: secondBlock.run()}))   
}