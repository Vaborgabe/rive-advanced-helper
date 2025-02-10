import RiveCanvas, {
    File,
    Artboard,
    SMIInput,
    TextValueRun,
    Node,
    RiveCanvas as RiveCanvasType,
    AABB,
    StateMachineInstance,
    SMITrigger,
    SMIBool,
    SMINumber,
    RootBone,
    Fit,
    Alignment
} from "@rive-app/canvas-advanced";

let rive: any;
let canvas: HTMLCanvasElement;
let renderer: any;
let riveInstances: Array<RiveInstance> = [];
let running = false;

class RuntimeLoader {
    private runtime;
    private isLoading = false;
    private callBackQueue: Array<Function> = [];
    private wasmPath: string;

    public constructor(wasmPath: string) {
        this.wasmPath = wasmPath;
    }

    private loadRuntime() {
        RiveCanvas({
            locateFile: (_) => this.wasmPath
        }).then((riveInst) => {
            this.runtime = riveInst;
            rive = riveInst;
            // Fire callbacks
            while (this.callBackQueue.length > 0) {
                const callback = this.callBackQueue.shift();
                if(callback) {
                    callback(this.runtime);
                }
            }
        });
    }

    public getInstance(callback: Function) {
        if(!this.isLoading) {
            this.isLoading = true;
            this.loadRuntime();
        } if(!this.runtime) {
            this.callBackQueue.push(callback);
        } else {
            callback(this.runtime);
        }
    }

    public awaitInstance() {
        return new Promise((resolve, reject) => 
            this.getInstance((rive) => resolve(rive))
        );
    }

    public setWasmPath(wasmPath: string) {
        this.wasmPath = wasmPath;
    }
}

function defaultRendererSetup(canvasElement: HTMLCanvasElement, rive: RiveCanvasType) {
    canvas = canvasElement;
    const { width, height } = canvasElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio;
    canvasElement.width = width * dpr;
    canvasElement.height = height * dpr;
    renderer = rive.makeRenderer(canvasElement);

    return renderer;
}

class RivFile {
    private bytes: Uint8Array;
    private file: File;
    private location: string;

    public constructor(location: string) {
        this.location = location;
    }

    public async load() {
        this.bytes = new Uint8Array(
            await (await fetch(new Request(this.location))).arrayBuffer()
        );
        this.file = await rive.load(this.bytes) as File;
    }

    public getFile() {
        return this.file;
    }

    public getLocation() {
        return this.location;
    }

    public setLocation(location: string) {
        this.location = location;
    }

    public defaultArtboard() {
        return this.file.defaultArtboard();
    }

    public artboardByName(name: string) {
        return this.file.artboardByName(name);
    }

    public artboardByIndex(index: number) {
        return this.file.artboardByIndex(index);
    }

    public artboardCount() {
        return this.file.artboardCount();
    }

    public artboards() {
        let artboards: Array<Artboard> = [];
        for(let i = 0; i < this.artboardCount(); i++) {
            artboards.push(this.file.artboardByIndex(i));
        }
        return artboards;
    }

    public delete() {
        this.file.delete();
    }
}

function loadAllRivFiles(files: Array<RivFile>) {
    return Promise.all(files.map(file => file.load()));
}

interface eventObject {
    event: string;
    cb: Function;
}

interface pointerSettingsObject {
    mouseMove: boolean;
    mouseDown: boolean;
    mouseUp: boolean;
}

/* RiveInstance TODO:

State Machine Instance Delete
Artboard Delete
OpenURLEvent

*/

class RiveInstance {
    private file: RivFile;
    public artboard: Artboard;
    public stateMachine: StateMachineInstance;
    private boolArray: Array<SMIInput> = [];
    private numberArray: Array<SMIInput> = [];
    private triggerArray: Array<SMIInput> = [];
    public renderFunction: Function;
    private events: Array<eventObject> = [];
    private pointerSettings: pointerSettingsObject = {
        mouseMove: true,
        mouseDown: true,
        mouseUp: true
    };
    public alignSettings: {
        fit: Fit,
        alignment: Alignment,
        destination: AABB,
        source: AABB
    }

    public constructor(file: RivFile, artboard?: any, stateMachine?: any) {
        this.file = file;
        if(artboard !== undefined) {
            if(typeof artboard === "string") {
                this.artboard = file.artboardByName(artboard);
            } else if(typeof artboard === "number") {
                this.artboard = file.artboardByIndex(artboard);
            } else if (typeof artboard === "object" && artboard.name && artboard.bounds) {
                this.artboard = artboard;
            } else {
                console.error("Invalid artboard type");
            }
        } if(stateMachine !== undefined) {
            if(typeof stateMachine === "string") {
                this.stateMachine = new rive.StateMachineInstance(
                    this.artboard.stateMachineByName(stateMachine),
                    this.artboard
                );
                this.sortInputs();
            } else if(typeof stateMachine === "number") {
                this.stateMachine = new rive.StateMachineInstance(
                    this.artboard.stateMachineByIndex(stateMachine),
                    this.artboard
                );
                this.sortInputs();
            } else if (typeof stateMachine === "object" && stateMachine.name && stateMachine.inputCount == undefined) {
                this.stateMachine = new rive.StateMachineInstance(
                    stateMachine,
                    this.artboard
                );
                this.sortInputs();
            } else if (typeof stateMachine === "object" && stateMachine.g.u.name) {
                this.stateMachine = stateMachine;
                this.sortInputs();
            } else {
                console.error("Invalid state machine type");
            }
        }

        this.alignSettings = {
            fit: rive.Fit.contain,
            alignment: rive.Alignment.center,
            destination: {
                minX: 0,
                minY: 0,
                maxX: canvas.width,
                maxY: canvas.height
            },
            source: this.artboard.bounds
        }

        riveInstances.push(this);
    }

    private sortInputs() {
        this.boolArray = [];
        this.numberArray = [];
        this.triggerArray = [];
        for(let i = 0; i < this.stateMachine.inputCount(); i++) {
            const input = this.stateMachine.input(i);
            if(input.type == 54) this.boolArray.push(input.asBool());
            if(input.type == 56) this.numberArray.push(input.asNumber());
            if(input.type == 58) this.triggerArray.push(input.asTrigger());
        }
    }

    private eventManager() {
        let numStatesChanged = this.stateMachine.stateChangedCount();
        for(let i = 0; i < numStatesChanged; i++) {
            let stateChanged = this.stateMachine.stateChangedNameByIndex(i);
            if(stateChanged != undefined) {
                this.events.forEach(event => {
                    if(event.event == stateChanged) event.cb();
                });
            }
        }
        let numEvents = this.stateMachine.reportedEventCount();
        for(let i = 0; i < numEvents; i++) {
            let event = this.stateMachine.reportedEventAt(i);
            if(event != undefined) {
                this.events.forEach(eventObject => {
                    if(eventObject.event == event?.name) eventObject.cb(event);
                });
            }
        }
    }

    public getBool(name: string) {
        let bool;
        this.boolArray.forEach(input => {
            if(input.name == name) bool = input.value;
        });
        return bool;
    }

    public setBool(name: string, value: boolean) {
        this.boolArray.forEach(input => {
            if(input.name == name) input.value = value;
        });
    }

    public getNumber(name: string) {
        let number;
        this.numberArray.forEach(input => {
            if(input.name == name) number = input.value;
        });
        return number;
    }

    public setNumber(name: string, value: number) {
        this.numberArray.forEach(input => {
            if(input.name == name) input.value = value;
        });
    }

    public trigger(name: string) {
        this.triggerArray.forEach(trigger => {
            if(trigger.name == name) {
                trigger.fire();
            }
        });
    }

    public on(event: string, cb: Function) {
        this.events.push({event, cb});
    }

    public bone(name: string) {
        return this.artboard.bone(name);
    }

    public node(name: string) {
        return this.artboard.node(name);
    }

    public rootBone(name: string) {
        return this.artboard.rootBone(name);
    }

    public transformComponent(name: string) {
        return this.artboard.transformComponent(name);
    }

    public textRun(name: string) {
        return this.artboard.textRun(name);
    }

    public setText(name: string, text: string) {
        this.artboard.textRun(name).text = text;
    }

    public inputByPath(name: string, path: string) {
        return this.artboard.inputByPath(name, path);
    }

    public defaultMouseMove(b: boolean) {
        this.pointerSettings.mouseMove = b;
    }

    public defaultMouseDown(b: boolean) {
        this.pointerSettings.mouseDown = b;
    }

    public defaultMouseUp(b: boolean) {
        this.pointerSettings.mouseUp = b
    }

    public setMousePos(x, y) {
        this.stateMachine.pointerMove(x, y);
    }

    public setMouseDown(x, y) {
        this.stateMachine.pointerDown(x, y);
    }

    public setMouseUp(x, y) {
        this.stateMachine.pointerUp(x, y);
    }

    public remove() {
        riveInstances = riveInstances.filter(instance => instance !== this);
    }

    public async __render(elapsedTimeSec: number) {
        this.stateMachine.advance(elapsedTimeSec);
        
        this.eventManager();

        if(this.renderFunction) this.renderFunction();

        this.artboard.advance(elapsedTimeSec);
        renderer.save();
    }

    public async __align() {
        renderer.align(
            this.alignSettings.fit,
            this.alignSettings.alignment,
            this.alignSettings.destination,
            this.alignSettings.source
        )

        this.artboard.draw(renderer);
        renderer.restore();
    }

    public __mouseMove(x: number, y: number) {
        if(this.pointerSettings.mouseMove) {
            this.stateMachine.pointerMove(x, y);
        }
    }

    public __mouseDown(x: number, y: number) {
        if(this.pointerSettings.mouseDown) {
            this.stateMachine.pointerDown(x, y);
        }
    }

    public __mouseUp(x: number, y: number) {
        if(this.pointerSettings.mouseUp) {
            this.stateMachine.pointerUp(x, y);
        }
    }
}

window.onmousemove = (e) => {
    let x = e.x;
    let y = e.y;
    
    for(let instance of riveInstances) {
        instance.__mouseMove(x, y);
    }
};

window.onmousedown = (e) => {
    let x = e.x;
    let y = e.y;

    for(let instance of riveInstances) {
        instance.__mouseDown(x, y);
    }
};

window.onmouseup = (e) => {
    let x = e.x;
    let y = e.y;

    for(let instance of riveInstances) {
        instance.__mouseUp(x, y);
    }
};

function getRiveInstances() {
    return riveInstances;
}

let lastTime = 0;
async function renderLoop(time) {
    if(!lastTime) {
        lastTime = time;
    }
    const elapsedTimeMs = time - lastTime;
    const elapsedTimeSec = elapsedTimeMs / 1000;
    lastTime = time;

    renderer.clear();

    //await each render
    riveInstances.forEach(async instance => instance.__render(elapsedTimeSec));
    riveInstances.forEach(instance => instance.__align());


    if(running) rive.requestAnimationFrame(renderLoop);
}

function startRenderLoop() {
    running = true;
    rive.requestAnimationFrame(renderLoop);
}

function stopRenderLoop() {
    running = false;
}

//SliderController object, inputNode, axis, min, max, and then a % update function

class SliderController {
    private inputNode: Node | RootBone;
    private axis: string;
    private min: number;
    private max: number;
    private pct: number = 0;
    private minVal: number;
    private maxVal: number;
    private x: boolean;
    private pctMode: boolean = true;
    private eventArray: Array<eventObject> = [];
    private lastVal: number = 0;

    public constructor(inputNode: Node | RootBone, axis: string, min: number, max: number, minVal?: number, maxVal?: number) {
        this.inputNode = inputNode;
        this.axis = axis.toLowerCase();
        this.min = min;
        this.max = max;
        if(this.axis == 'x') {
            this.x = true;
        } else if (this.axis == 'y') {
            this.x = false;
        } else {
            console.error("Invalid axis");
        }

        if(minVal != undefined && maxVal != undefined) {
            this.pctMode = false;
            this.minVal = minVal;
            this.maxVal = maxVal;
        } else {
            this.pctMode = true;
        }
    }

    public update(value: number) {
        this.eventArray.forEach(event => {
            if(event.event == "update") event.cb(value);
        });
        let sum = ((this.pctMode) ? value : (value - this.minVal) / (this.maxVal - this.minVal)) * (this.max - this.min) + this.min;
        if(!this.pctMode) {
            this.lastVal = value;
        }

        if(sum >= this.max) {
            this.eventArray.forEach(event => {
                if(event.event == "max") event.cb();
            });
        }

        (this.x) ? this.inputNode.x = sum : this.inputNode.y = sum;
    }

    public increase(value: number) {
        this.update(this.lastVal + value);
    }

    public on(event: string, cb: Function) {
        this.eventArray.push({event, cb});
    }

    public setValRange(minVal: number, maxVal: number) {
        this.minVal = minVal;
        this.maxVal = maxVal;
        this.pctMode = false;
    }
}

//JoysticController object, inputNode, min, max, and then a % update function

module.exports = {
    RuntimeLoader,
    renderer,
    defaultRendererSetup,
    RivFile,
    loadAllRivFiles,
    RiveInstance,
    getRiveInstances,
    startRenderLoop,
    stopRenderLoop,
    SliderController
};