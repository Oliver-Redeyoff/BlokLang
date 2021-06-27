// universal types
export type blockPosition = {x:number, y:number};
export interface defaultProperties {color: string};
export interface FtBMapping {frontendId: number, backendObject: any};

// block specific types
export enum EBlocks {
    variable = 1,
    evaluate = 2
}