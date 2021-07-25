import block from './block.js';
import { defaultProperties } from './types.js';

type inputType = {};
type outputType = number;
interface propertiesType extends defaultProperties {value: any}

export default class extends block<inputType, outputType, propertiesType> {

    properties:propertiesType = {
        name: 'Variable',
        color: 'rgb(72, 123, 65)',
        value: 1,
        size: {width: 120, height: 40}
    }

    async runInternal(input: inputType): Promise<outputType> {
        return this.properties.value;
    }

}