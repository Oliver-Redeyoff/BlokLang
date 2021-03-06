import { EBlokType, blok, blokLink } from './types.js';
import variableBlock from './variableBlock.js';
import evaluateBlock from './evaluateBlock.js';



//////////////////
// BLOK FACTORY //
//////////////////

// Factory method for instantiating a blok object
var blokCount = 0;
export function blokFactory(blockType: EBlokType) {
    ++blokCount;
    switch(blockType){
        case EBlokType.variable:
            return new variableBlock(blokCount);
        case EBlokType.evaluate:
            return new evaluateBlock(blokCount);
    }
}



///////////////
// RUN LOGIC //
///////////////

// Runs a blok pile by running the bloks in the tree in order of maximum tree depth
export async function runBlokPile(blokPile: blok[], blokLinks: blokLink[]) {

    let blokTree = createBlokTreeRec(blokPile, blokLinks);
    console.log(blokTree);

    let isRunning = true;
    let depth = 1;
    let i = 0;
    while(isRunning) {

        // Prevent infinite loop
        if(i > 10000) {
            isRunning = false;
        }

        // Get all bloks in tree at depth
        let blokBatch = getBloksAtMaxDepth(blokTree, depth);
        if(blokBatch.length == 0) {
            isRunning = false;
        }

        blokBatch.forEach(async (blok) => {

            let blokInputs: any = {};
            
            for(const inputBlok of blok.inputRefs) {
                blokInputs[inputBlok.inputKey] = await inputBlok.blokRef.backendObject.run();
            }
            
            console.log('running blok : ' + blok.frontendId);
            console.log(blokInputs);
            console.log(await blok.backendObject.run(blokInputs));
        })

        ++depth;
        ++i;
    }
}

// Creates a blok tree by linking linked bloks together
function createBlokTreeRec(blokPile: blok[], blokLinks: blokLink[]) {
    
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



////////////////////
// HELPER METHODS //
////////////////////

function getBlokId(Id: string) {
    return Id.split('-')[0];
}

function getInputKey(Id: string) {
    return Id.split('-')[1].split('/')[1];
}

function getBloksAtMaxDepth(blokTree: blok[], depth: number) {

    let result: blok[] = [];

    blokTree.forEach(blok => {
        if(getBlokMaxDepthRec(blok, 0) == depth) {
            result.push(blok);
        }
    }); 

    return result;
}

function getBlokMaxDepthRec(blok: blok, maxDepth: number): number{
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