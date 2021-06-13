import { blockPosition } from './types';

export default class {

    position: blockPosition;

    constructor(position: blockPosition){
        this.position = position;
    }

    run(input:{}) {
        let output:{};
        return output;
    }

    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }

}