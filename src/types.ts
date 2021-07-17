// universal types
export interface defaultProperties {color: string};

export interface canvasBlok {frontendId: string, backendObject: any};
export interface blokLink {lineFrontendId: string, originFrontendId: string, destinationFrontendId: string};

// block specific types
export enum EBlokType {
    variable = 1,
    evaluate = 2
}