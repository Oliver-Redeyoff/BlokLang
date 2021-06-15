import block from './block.js';
import { blockPosition, defaultProperties } from './types.js';

interface inputType {x: number, y: number};
type outputType = boolean;
interface propertiesType extends defaultProperties {expression: string}

export default class extends block<inputType, outputType, propertiesType> {

    input:inputType = {} as inputType;
    output:outputType = {} as outputType;

    properties:propertiesType = {
        expression: ""
    }
    
    constructor(position: blockPosition){
        super(position);
    }

    run(input: inputType): outputType {
        for (const prop in input) {
            if(prop == "x") this.properties.expression = this.properties.expression.replace("x", input.x.toString())
            if(prop == "y") this.properties.expression = this.properties.expression.replace("y", input.x.toString())
            //this.properties.expression.replace(prop, input[prop])
        }
        return eval(this.properties.expression);
    }

}