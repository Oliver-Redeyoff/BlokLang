import block from './block';
import { blockPosition } from './types';

type inputType = {};
type outputType = number | string;

export default class extends block {

    input:inputType;
    output:outputType;
    
    constructor(position: blockPosition){
        super(position);
    }

    run(_:inputType) {
        this.output = 5;
        return this.output;
    }

}