import { defaultProperties, typeGuards, inputTypeCheckers } from './types.js';

var inputs = {}

export default class<inputsType, outputType, propertyType extends defaultProperties> {

    inputs: inputTypeCheckers[] = [];
    properties: propertyType = {} as propertyType;

    // Checks if an input is valid, by default accepts anything
    validateInput(inputKey: string, inputCandidate: any): boolean{
        let inputCheckersTemp: inputTypeCheckers[] = this.inputs.filter(input => input.inputKey == inputKey);

        // there should be exactly one corresponding input
        if(inputCheckersTemp.length != 1) return false;
        
        let inputChecker: inputTypeCheckers = inputCheckersTemp[0];

        // check that each typeGuard is valid
        let inputIsValid = true;
        inputChecker.typeGuardKeys.forEach(typeGuardKey => {
            if(!typeGuards[typeGuardKey](inputCandidate)) inputIsValid = false;
        })

        return inputIsValid;
    }
    
    // Runs the internal logic of block given the input
    run(input:inputsType):outputType {
        return {} as outputType;
    }

    // Updates inner properties of blok
    setProperties(properties: Partial<propertyType>){
        this.properties = {...this.properties, ...properties};
    }

    get color(): string {
        return this.properties.color ?? "";
    }

}