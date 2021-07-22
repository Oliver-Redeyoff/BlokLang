// universal types
export interface defaultProperties {name: string, color: string};
export interface inputTypeCheckers {inputKey: string, typeGuardKeys: typeGuardsKeys[]}

export interface blok {frontendId: string, backendObject: any, inputRefs: inputRef[], outputRef: blok};
export interface inputRef {inputKey: string, blokRef: blok};

export interface blokLink {lineFrontendId: string, originFrontendId: string, destinationFrontendId: string};

// block specific types
export enum EBlokType {
    variable = 1,
    evaluate = 2
}


// Type checking methods
export var typeGuards = {
    isNumber: function(input: any) {
        return !isNaN(input);
    },
    isBoolean: function(input: any) {
        return typeof input == "boolean";
    }
}
type typeGuardsKeys = keyof typeof typeGuards;