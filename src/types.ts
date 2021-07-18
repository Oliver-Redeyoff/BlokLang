// universal types
export interface defaultProperties {color: string};
export interface inputTypeCheckers {key: string, typeGuardKeys: typeGuardsKeys[]}

export interface canvasBlok {frontendId: string, backendObject: any};
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