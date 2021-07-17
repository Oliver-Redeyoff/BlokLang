import { EBlokType, canvasBlok, blokLink } from './types.js';
import variableBlock from './variableBlock.js';
import evaluateBlock from './evaluateBlock.js';

// this is where the program is declared as a bunch of linked block classes
export function runBlokPile(blokPile: canvasBlok[], blokLinks: blokLink[]) {

    console.log(blokPile);
    console.log(blokLinks);

    var firstBlock = new variableBlock();
    firstBlock.setProperties({value: 20});
    
    var secondBlock = new variableBlock();
    secondBlock.setProperties({value: 40});

    var thirdBlock = new evaluateBlock();
    thirdBlock.setProperties({expression: "x + y"})
    return(thirdBlock.run({x: firstBlock.run(), y: secondBlock.run()}))   
}

export function blockFactory(blockType: EBlokType) {
    switch(blockType){
        case EBlokType.variable:
            return new variableBlock();
        case EBlokType.evaluate:
            return new evaluateBlock();
    }
}