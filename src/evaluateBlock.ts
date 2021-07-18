import block from './block.js';
import { defaultProperties, inputTypeCheckers } from './types.js';

interface inputsType {x: number, y: number};
type outputType = boolean;
interface propertiesType extends defaultProperties {expression: string}

export default class extends block<inputsType, outputType, propertiesType> {

    inputs: inputTypeCheckers[] = [
        {inputKey: 'x', typeGuardKeys: ['isNumber']},
        {inputKey: 'y', typeGuardKeys: ['isNumber']}
    ];

    properties:propertiesType = {
        color: 'black',
        expression: ""
    }

    run(inputs: inputsType): outputType {
        for (const prop in inputs) {
            if(prop == "x") this.properties.expression = this.properties.expression.replace("x", inputs.x.toString())
            if(prop == "y") this.properties.expression = this.properties.expression.replace("y", inputs.y.toString())
        }
        return eval(this.properties.expression);
    }

}