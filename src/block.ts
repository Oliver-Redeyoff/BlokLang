import { defaultProperties, typeGuards, inputTypeCheckers } from './types.js';

export default class<inputsType, outputType, propertyType extends defaultProperties> {

    inputs: inputTypeCheckers[] = [];
    properties: propertyType = {} as propertyType;

    cachedOutput: outputType | null = null;

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
    run(input: inputsType):outputType {

        // Validate the input
        this.inputs.forEach(inputChecker => {
            let inputIsValid = true;

            if(inputChecker.inputKey in input) {
                inputIsValid = this.validateInput(inputChecker.inputKey, input[inputChecker.inputKey as keyof inputsType]);
            } else {
                inputIsValid = this.validateInput(inputChecker.inputKey, null);
            }
            if(!inputIsValid) {
                throw("Input " + inputChecker.inputKey + " is no valid.");
            }
        });

        if(this.cachedOutput == null) {
            let output = this.runInternal(input);
            this.cachedOutput = output;
            return output;
        } else {
            return this.cachedOutput;
        }

    }

    runInternal(input: inputsType): outputType {
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