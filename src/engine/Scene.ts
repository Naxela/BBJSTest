import * as BABYLON from "@babylonjs/core";
import { NAXApp } from "../NAXApp";
import { NXCamera } from "./Camera";
import { NXLight } from "./Light";
import { NXAssetManager } from "./AssetManager";
import { NXLogger } from "./Logger";

export class NXScene {

    private app: NAXApp;
    public babylonScene: BABYLON.Scene
    public activeCamera: any;

    public sceneData = null;
    public scene3D = null; //ThreeJS Scene
    public renderer = null; //ThreeJS Renderer
    public cameraManager = null;
    public lightManager = null;
    public speakerManager = null;
    public materialManager = null;
    public curveManager = null;
    public mixer = null;
    public listener = null;
    public animations = [];
    public sceneIDTable = {}; //Every object in scene needs one unique ID

    constructor(readonly engine: BABYLON.Engine, app: NAXApp) {

        NXLogger.log('Creating scene');
        
        if(this.babylonScene) {
            this.cleanScene();
        }
        

        this.babylonScene = new BABYLON.Scene(engine);
        this.app = app;


        NXLogger.log('Adjusting texture loader');
        // @ts-ignore: Ignore ThinEngine texture loader
        BABYLON.ThinEngine._TextureLoaders.splice(0, 0, {
            
            supportCascades: false,
        
            canLoad: (extension) => {
                return BABYLON.StringTools.EndsWith(extension, ".hdr");
            },
        
            loadData: (data, texture, callback) => {
                var bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        
                var hdrInfo = BABYLON.HDRTools.RGBE_ReadHeader(bytes);
                var pixels = BABYLON.HDRTools.RGBE_ReadPixels(bytes, hdrInfo);
        
                texture.type = BABYLON.Constants.TEXTURETYPE_FLOAT;
                texture.format = BABYLON.Constants.TEXTUREFORMAT_RGB;
        
                // Mip maps can not be generated on FLOAT RGB textures.
                texture.generateMipMaps = false;
                
                callback(hdrInfo.width, hdrInfo.height, texture.generateMipMaps, false, () => {
                    texture.getEngine()._uploadDataToTextureDirectly(texture, pixels, 0, 0, undefined, true);
                });
            }
        });

        //To we need a scene loader?
        //There is an option to make this a custom one

        //Stop the time
        /*

        If you want to control it manually, you can use:

        engine.runRenderLoop(function () { 
                if(!scene.paused){
                    scene.render();
                }
        });
        for you own render loop and set scene.paused when you want.

        Or

        scene.freezeActiveMeshes();

        */

        //Setup environment
        this.createEnvironment();

        //Load assets
        this.loadAssets();

        //Setup cameras
        this.createCameras();

        //Setup lights
        this.createLights();

        //Setup speakers
        this.createSpeakers();

        //Setup postprocess?
        //this.setupPostprocess(engine);

        //Something XR?

        //Remove loadingscreen
        //Automatic?
        

    }

    cleanScene() {

        NXLogger.log('Cleaning scene');

        this.babylonScene.dispose();
        delete this.activeCamera;

    }

    createEnvironment(){

        let sceneData = {
            environment: {
                backgroundType: "x"
            }
        };

        if(sceneData.environment.backgroundType == "color") {
            this.babylonScene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
            this.babylonScene.ambientColor = new BABYLON.Color3(1.3, 0.0, 0.0);
        } else if(sceneData.environment.backgroundType == "texture") {
            this.babylonScene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
            this.babylonScene.ambientColor = new BABYLON.Color3(1.3, 0.0, 0.0);
        } else if(sceneData.environment.backgroundType == "sky") {
            this.babylonScene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
            this.babylonScene.ambientColor = new BABYLON.Color3(1.3, 0.0, 0.0);
        } else {
            this.babylonScene.clearColor = new BABYLON.Color4(0.8, 0.1, 0.1, 1.0);
            this.babylonScene.ambientColor = new BABYLON.Color3(1.3, 0.0, 0.0);
        }


    }

    createCameras() {

        //this.activeCamera = new NXCamera(this.babylonScene, this.app.canvas);
        NXCamera.setupCameras(this.babylonScene, this.app.canvas);

    }

    //Create lights
    createLights() {

        NXLight.setupLights();

    }

    createSpeakers(){

    }

    loadAssets() {
        
        const NAXAssetManager = new NXAssetManager(this.app.canvas);
        const canvas = document.getElementById('renderCanvas'); // Make sure this matches your actual canvas ID
        const assetManager = new NXAssetManager(this.app.canvas, this.app.engine, this.babylonScene);
        
        
        assetManager.loadAssets([
            { type: "model", name: "test", url: "assets/Dev.glb" }
        ]);

    }

    setupPostprocess(engine){

        //TODO - MOVE TO EXTERNAL FILE AND MAKE MORE MODULAR

        var standardPipeline = new BABYLON.DefaultRenderingPipeline("NAXStandardPipeline", true, this.babylonScene, [this.activeCamera]);

        standardPipeline.imageProcessingEnabled = true;
        standardPipeline.imageProcessing.exposure = 1.0;
        standardPipeline.imageProcessing.contrast = 1.0;
        standardPipeline.imageProcessing.toneMappingEnabled = true;

        standardPipeline.samples = 4;
        standardPipeline.imageProcessing.ditheringEnabled = true;

        engine.setHardwareScalingLevel(0.125);


        // var motionblur = new BABYLON.MotionBlurPostProcess(
        //     "mb", // The name of the effect.
        //     this.babylonScene, // The scene containing the objects to blur according to their velocity.
        //     1.0, // The required width/height ratio to downsize to before computing the render pass.
        //     this.activeCamera // The camera to apply the render pass to.
        // );
        // motionblur.motionStrength = 2; // double the blur effect
        // //motionblur.motionBlurSamples = 256;
        // motionblur.isObjectBased = false;

    }

}