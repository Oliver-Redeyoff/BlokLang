import { blockPosition, defaultProperties } from './types.js';

export default class<inputType, outputType, propertyType extends defaultProperties> {

    input: inputType = {} as inputType;
    output: outputType = {} as outputType;
    properties: propertyType = {} as propertyType;
    position: blockPosition;

    constructor(position: blockPosition){
        this.position = position;
    }

    run(input:inputType):outputType {
        return this.output;
    }

    setProperties(properties:propertyType){
        this.properties = {...this.properties, ...properties};
    }

    get x():number {
        return this.position.x;
    }
    get y():number {
        return this.position.y;
    }

    get inputType() {
        return typeof this.input;
    }
    get outputType() {
        return typeof this.output;
    }

    get color(): string {
        return this.properties.color ?? "";
    }

}