// universal types
export type blockPosition = {x:number, y:number};
export interface defaultProperties {color: string};

export interface canvasBlock {frontendId: string, backendObject: any};
export interface blockLink {lineFrontendId: string, originFrontendId: string, destinationFrontendId: string};

// block specific types
export enum EBlocks {
    variable = 1,
    evaluate = 2
}