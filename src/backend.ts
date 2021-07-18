import { EBlokType, canvasBlok, blokLink } from './types.js';
import variableBlock from './variableBlock.js';
import evaluateBlock from './evaluateBlock.js';

// this is where the program is declared as a bunch of linked block classes
export function runBlokPile(blokPile: canvasBlok[], blokLinks: blokLink[]) {

    let blokTree = createBlokTreeRec(blokPile, blokLinks);
    console.log(blokTree);

    let isRunning = true;
    let depth = 0;
    let i = 0;
    while(isRunning) {

        // Prevent infinite loop
        if(i > 10000) {
            isRunning = false;
        }

        // Get all bloks in tree at depth
        let blokBatch = getBloksAtMaxDepth(blokTree, depth);
        console.log(depth);
        console.log(blokBatch);
        if(blokBatch.length == 0) {
            isRunning = false;
        }

        ++depth;
        ++i;
    }

    // var firstBlock = new variableBlock();
    // firstBlock.setProperties({value: 20});
    
    // var secondBlock = new variableBlock();
    // secondBlock.setProperties({value: 40});

    // var thirdBlock = new evaluateBlock();
    // thirdBlock.setProperties({expression: "x + y"})
    // return(thirdBlock.run({x: firstBlock.run(), y: secondBlock.run()}))   
}

function createBlokTreeRec(blokPile: canvasBlok[], blokLinks: blokLink[]) {
    // for each blok :
    // - look if it has any incomming inputs, add reference to that blok as well as the key that the input is for
    try {
        blokPile.forEach(blok => {

            // see if any blokLinks exist where this blok is the destination (add inputs to this blok)
            let blokInputs = blokLinks.filter(blokLink => getBlokId(blokLink.destinationFrontendId) == blok.frontendId)
            if(blokInputs.length > 0) {
                blokInputs.forEach(blokInput => {
                    // get corresponding origin blok from blokPile
                    let inputBloksTemp = blokPile.filter(b => b.frontendId == getBlokId(blokInput.originFrontendId));
                    if(inputBloksTemp.length != 1) throw('There is an issue with blok links');
                    blok.inputRefs.push({inputKey: getInputKey(blokInput.destinationFrontendId), blokRef: inputBloksTemp[0]});
                })
            }

            // see if any blokLinks exist where this blok is the origin
            let blokOutput = blokLinks.filter(blokLink => getBlokId(blokLink.originFrontendId) == blok.frontendId)
            if(blokOutput.length > 1) throw('Output of a blok is used for more that one link');
            else if(blokOutput.length == 1) {
                let outputBloksTemp = blokPile.filter(b => b.frontendId == getBlokId(blokOutput[0].destinationFrontendId));
                if(outputBloksTemp.length != 1) throw('There is an issue with blok links');
                blok.outputRef = outputBloksTemp[0];
            }

        });
    } catch(e){
        console.log("Error while creating bloktree :")
        console.log(e);
    }

    return blokPile;
}

export function blockFactory(blockType: EBlokType) {
    switch(blockType){
        case EBlokType.variable:
            return new variableBlock();
        case EBlokType.evaluate:
            return new evaluateBlock();
    }
}


// Helper methods
function getBlokId(Id: string) {
    return Id.split('-')[0];
}
function getInputKey(Id: string) {
    return Id.split('-')[1].split('/')[1];
}

function getBloksAtMaxDepth(blokTree: canvasBlok[], depth: number) {

    let result: canvasBlok[] = [];

    blokTree.forEach(blok => {
        if(getBlokMaxDepthRec(blok, 0) == depth) {
            result.push(blok);
        }
    }); 

    return result;
}
function getBlokMaxDepthRec(blok: canvasBlok, maxDepth: number): number{
    if(blok.inputRefs.length == 1) {
        return getBlokMaxDepthRec(blok.inputRefs[0].blokRef, maxDepth+1);
    }
    else if(blok.inputRefs.length > 1) {
        let maxDepths: number[] = [];
        blok.inputRefs.forEach(inputRef => {
            maxDepths.push(getBlokMaxDepthRec(inputRef.blokRef, maxDepth+1));
        })
        return Math.max(...maxDepths);
    } else {
        return maxDepth;
    }
}