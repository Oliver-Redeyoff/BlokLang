import { EBlocks } from './types.js';
import variableBlock from './variableBlock.js';
import evaluateBlock from './evaluateBlock.js';

// this is where the program is declared as a bunch of linked block classes
export function test() {
    var firstBlock = new variableBlock();
    firstBlock.setProperties({value: 20});
    
    var secondBlock = new variableBlock();
    secondBlock.setProperties({value: 40});

    var thirdBlock = new evaluateBlock();
    thirdBlock.setProperties({expression: "x + y"})
    return(thirdBlock.run({x: firstBlock.run(), y: secondBlock.run()}))   
}

export function blockFactory(blockType: EBlocks) {
    switch(blockType){
        case(EBlocks.variable):
            return new variableBlock();
        case(EBlocks.evaluate):
            return new evaluateBlock();
    }
}