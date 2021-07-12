import { blockPosition, defaultProperties } from './types.js';

export default class<inputType, outputType, propertyType extends defaultProperties> {

    input: inputType = {} as inputType;
    output: outputType = {} as outputType;
    properties: propertyType = {} as propertyType;

    // Checks if an input is valid for, by default the block doesn't accept input so this returns false
    validateInput(key: string, inputCandidate: any){
        return false;
    }
    
    // Runs the internal logic of block given the input
    run(input:inputType):outputType {
        return this.output;
    }

    setProperties(properties: Partial<propertyType>){
        this.properties = {...this.properties, ...properties};
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