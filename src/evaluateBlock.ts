import block from './block.js';
import { defaultProperties } from './types.js';

interface inputType {x: number, y: number};
type outputType = boolean;
interface propertiesType extends defaultProperties {expression: string}

export default class extends block<inputType, outputType, propertiesType> {

    input:inputType = {
        x: 0,
        y: 0
    };
    output:outputType = false;

    properties:propertiesType = {
        color: 'black',
        expression: ""
    }

    validateInput(key: string, inputCandidate: any){
        if(!('x' in inputCandidate)) return false;
        if(inputCandidate.x == null) return false;
        if(!('y' in inputCandidate)) return false;
        if(inputCandidate.y == null) return false;
        return true;
    }

    run(input: inputType): outputType {
        for (const prop in input) {
            if(prop == "x") this.properties.expression = this.properties.expression.replace("x", input.x.toString())
            if(prop == "y") this.properties.expression = this.properties.expression.replace("y", input.y.toString())
        }
        return eval(this.properties.expression);
    }

}