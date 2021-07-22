import Konva from 'konva';
import { Group } from 'konva/lib/Group';
import { defaultProperties, typeGuards, inputTypeCheckers, blokLink } from './types.js';

export default class<inputsType, outputType, propertyType extends defaultProperties> {

    id: number = 0;
    inputs: inputTypeCheckers[] = [];
    properties: propertyType = {} as propertyType;

    cachedOutput: outputType | null = null;

    constructor(id: number) {
        this.id = id;
    }

    // Render the blok into a Konva group and return to frontend
    renderBlok(x: number, y: number, createLinkCallback: Function, updateLinkPosCallback: Function, updateLinkBufferCallback: Function): Group {
        let blokId = 'blok'+this.id;

        let blokWidth = 200;
        let blokHeight = 200;

        // block group
        let frontendBlok = new Konva.Group({
            draggable: true,
            id: blokId
        })
        frontendBlok.on('dragmove', function() { updateLinkPosCallback(this.id()); });

        // background box
        let box = new Konva.Rect({
            x: x,
            y: y,
            width: blokWidth,
            height: blokHeight,
            fill: this.properties.color,
            cornerRadius: 5,
            id: blokId + '-bg'
        });
        box.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
        box.on('mouseout', function () {
            document.body.style.cursor = 'default';
        });
        frontendBlok.add(box)

        // text
        let text = new Konva.Text({
            x: x+blokWidth/2,
            y: y+blokHeight/2,
            text: this.properties.name,
            fontSize: 24,
            fontFamily: 'Calibri',
            fill: 'white',
            id: blokId + '-text'
        });
        text.offsetX(text.width() / 2);
        text.offsetY(text.height() / 2);
        frontendBlok.add(text);

        // inputs
        let inputKeys = this.inputs.map(input => input.inputKey);
        let blockInputs = new Konva.Group()
        inputKeys.forEach((inputKey, index) => {
            let circle = new Konva.Circle({
                x: x,
                y: y + blokHeight/2 + 25*index,
                radius: 10,
                fill: 'red',
                id: blokId + '-input/'+inputKey
            });
            circle.on('mouseover', function () {
                this.fill('green')
            });
                circle.on('mouseout', function () {
                this.fill('red')
            });
            circle.on('click', function() {
                updateLinkBufferCallback(null, this.id());
                createLinkCallback();
            })
            blockInputs.add(circle);
        });
        frontendBlok.add(blockInputs)

        // output
        let circle = new Konva.Circle({
            x: x+blokWidth,
            y: y+blokHeight/2,
            radius: 10,
            fill: 'blue',
            id: blokId + '-output'
        });
        circle.on('mouseover', function () {
            this.fill('green')
        });
        circle.on('mouseout', function () {
            this.fill('blue')
        });
        circle.on('click', function() {
            updateLinkBufferCallback(this.id(), '');
        })
        frontendBlok.add(circle);

        return frontendBlok;
    }

    // Checks if an input is valid as defined by the inputs variable
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

        // If cached output exists return that, if not run and cache result
        if(this.cachedOutput == null) {
            let output = this.runInternal(input);
            this.cachedOutput = output;
            return output;
        } else {
            return this.cachedOutput;
        }
    }

    // Internal run logic of the blok, returns nothing by default
    runInternal(input: inputsType): outputType {
        return {} as outputType;
    }

    // Updates inner properties of blok
    setProperties(properties: Partial<propertyType>){
        this.properties = {...this.properties, ...properties};
    }

}