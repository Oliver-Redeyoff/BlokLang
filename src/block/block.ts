import { blockPosition } from './types.js';

export default class {

    position: blockPosition;
    input: {} = {};
    output: {} = {};

    constructor(position: blockPosition){
        this.position = position;
    }

    run(input:{}) {
        return this.output;
    }

    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }

    get inputType() {
        return typeof this.input;
    }
    get outputType() {
        return typeof this.output;
    }

}