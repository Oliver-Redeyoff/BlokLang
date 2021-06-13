import block from './block.js';
import { blockPosition } from './types.js';

type inputType = {};
type outputType = number | string;

export default class extends block {

    input:inputType = {};
    output:outputType = 0;
    
    constructor(position: blockPosition){
        super(position);
    }

    run() {
        this.output = 5;
        return this.output;
    }

}