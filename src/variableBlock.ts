import block from './block.js';
import { defaultProperties } from './types.js';

type inputType = {};
type outputType = number;
interface propertiesType extends defaultProperties {value: any}

export default class extends block<inputType, outputType, propertiesType> {

    properties:propertiesType = {
        color: 'black',
        value: {} as outputType
    }

    run(input: inputType = {}): outputType {
        return this.properties.value;
    }

}