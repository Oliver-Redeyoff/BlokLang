import block from './block.js';
import { blockPosition, defaultProperties } from './types.js';

type inputType = {};
type outputType = number;
interface propertiesType extends defaultProperties {value: any}

export default class<variableType> extends block<inputType, variableType, propertiesType> {

    properties:propertiesType = {
        value: {} as variableType
    }
    
    constructor(position: blockPosition){
        super(position);
    }

    run(): variableType {
        return this.properties.value;
    }

}