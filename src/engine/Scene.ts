import * as BABYLON from "@babylonjs/core";
import { NAXApp } from "../NAXApp";
import { NXAssetManager } from "./AssetManager";

export class NXScene {

    private app: NAXApp;
    public babylonScene: BABYLON.Scene
    public activeCamera: any;

    constructor(readonly engine: BABYLON.Engine, app: NAXApp) {

        this.babylonScene = new BABYLON.Scene(engine);
        this.app = app;

        this.createCameras();
        this.createLights();

        //let NAXAssetManager = new NXAssetManager(app.canvas);
        const canvas = document.getElementById('renderCanvas'); // Make sure this matches your actual canvas ID
        const assetManager = new NXAssetManager(canvas, app.engine, this.babylonScene);
        assetManager.loadAssets([
            { type: "model", name: "test", url: "assets/Dev.glb" }
        ]);

        this.babylonScene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        this.babylonScene.ambientColor = new BABYLON.Color3(1.3, 0.0, 0.0);

    }

    cleanScene() {

        this.babylonScene.dispose();
        delete this.activeCamera;

    }

    createCameras() {
        //Create cameras
        var camera = new BABYLON.ArcRotateCamera("camera", Math.PI/3, Math.PI/3, 10, BABYLON.Vector3.Zero(), this.babylonScene);

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(this.app.canvas, true);

        //Set scrolling speed
        camera.wheelPrecision = 50.0;


    }

    //Create lights
    createLights() {

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.babylonScene);

        // Default intensity is 1. Let's dim the light a small amount

    }

}