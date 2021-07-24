import block from './block.js';
import { defaultProperties, inputTypeCheckers } from './types.js';

interface inputsType {x: number, y: number};
type outputType = boolean;
interface propertiesType extends defaultProperties {expression: string}

export default class extends block<inputsType, outputType, propertiesType> {

    inputs: inputTypeCheckers[] = [
        {inputKey: 'x', typeGuardKeys: ['isNumber']},
        {inputKey: 'y', typeGuardKeys: ['isNumber']},
        {inputKey: 'z', typeGuardKeys: ['isNumber']}
    ];

    properties:propertiesType = {
        name: 'Evaluate',
        color: 'rgb(35, 39, 45)',
        expression: "x+y+z",
        size: {width: 150, height: 100}
    }

    runInternal(input: inputsType): outputType {
        for (const prop in input) {
            this.properties.expression = this.properties.expression.replace(prop, input[prop as keyof inputsType].toString());
        }
        return eval(this.properties.expression);
    }

}