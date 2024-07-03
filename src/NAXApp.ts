// Import all BabylonJS modules
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/materials";
import "@babylonjs/loaders";
import "@babylonjs/post-processes";
import '@babylonjs/inspector';

// Import NAX modules
import { NXLogger } from './engine/Logger';
import { NXUtility } from './engine/Utility';
import { NXScene } from './engine/Scene';

export class NAXApp {
    public engine!: BABYLON.Engine;
    public scene!: NXScene;
    public canvas!: HTMLCanvasElement;
    public projectData: any; //TODO - DECLARE TYPE

    /*

    Constructor => canvas + setupNAXEngine => initialize => run

    setupNAXEngine loads the project file



    */





    constructor(canvas: HTMLCanvasElement, readonly projectFile: string) {

        this.canvas = canvas; // Ensure canvas is assigned before async operations
        this.setupNAXEngine(projectFile).then(() => {
            NXLogger.log('Engine initialized');
            this.initialize().then(() => {
                this.run(true); // Ensure run is called after initialization
            });
        }).catch(error => {
            console.error("Failed to setup NAX Engine:", error);
        });

        // Resize handler setup
        window.addEventListener('resize', () => {
            if (this.engine) {
                this.engine.resize();
            }
        });

    }

    async setupNAXEngine(projectFile: string) {
        //Fetch the project file
        this.projectData = await NXUtility.loadJSON(projectFile);

        NXLogger.log('Project loaded');
        NXLogger.log(this.projectData);

        var WPG = false;

        //if(this.projectData.engine == "WEBGPU"){
        if(WPG){
            //Create a BabylonJS engine (WebGPU)
            this.engine = new BABYLON.WebGPUEngine(this.canvas);
            await this.engine.initAsync();
        } else {
            //Create a BabylonJS engine (WebGL)
            this.engine= new BABYLON.Engine(this.canvas)
        }
        
        //IF WEBGPU
        //this.engine = new BABYLON.WebGPUEngine(this.canvas);

        //Set the title of the page
        document.title = this.projectData.name;

    }

    async initialize(): Promise<void> {
        
        //IF WEBGPU
        //await this.engine.initAsync();

        this.scene = new NXScene(this.engine, this);
        // other scene setup
    }

    run(debug:Boolean) {

        if (debug) {
            this.scene.babylonScene.debugLayer.show({ overlay: true });
        } else {
            this.scene.babylonScene.debugLayer.hide();
        }

        this.engine.runRenderLoop(() => {
            this.scene.babylonScene.render();
        });
    }



}