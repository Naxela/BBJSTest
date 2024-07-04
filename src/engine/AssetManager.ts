import * as BABYLON from "@babylonjs/core";
import { Scene, Engine, AssetsManager } from "@babylonjs/core";
export class NXAssetManager {
    //private scene: Scene;
    //private engine: Engine;
    private assetsManager: AssetsManager;

    constructor(canvas: HTMLCanvasElement, engine, scene) {
        this.engine = engine;
        this.scene = scene;
        this.assetsManager = new AssetsManager(this.scene);

    }

    loadAssets(assetList: { type: string; name: string; url: string }[]) {
        assetList.forEach(asset => {
            switch (asset.type) {
                case 'model':
                    console.log("Loading model",asset.url);
                    const meshTask = this.assetsManager.addMeshTask(asset.name, "", "", asset.url);
                    meshTask.onSuccess = (task) => {
                        console.log(`${task.name} loaded successfully`);
                        task.loadedMeshes.forEach(mesh => {
                            this.scene.addMesh(mesh); // Add each loaded mesh to the scene

                            if(mesh.material){

                                //console.log("Adding mesh w. material", mesh.material.name);
                                //console.log("Adding mesh", mesh.name);

                                console.log("Adding LM", mesh.name + "_baked.hdr");

                                var sceneLightmap = new BABYLON.Texture("assets/Lightmaps/" + mesh.name + "_denoised.hdr", this.scene);
                                sceneLightmap.coordinatesIndex = 1;
                                sceneLightmap.vScale = -1;
                                mesh.material.lightmapTexture = sceneLightmap;
                                mesh.material.useLightmapAsShadowmap=true;
                                
                                console.log(sceneLightmap);


                            }



                            // if(lightmapSet != null){

                            //     if (lightmapSet[material.name] != undefined){
                            //         console.log("Lightmap found for: " + material.name);
                            //         var sceneLightmap = new BABYLON.Texture("Lightmaps/" + lightmapSet[material.name], scene);
                            //         sceneLightmap.coordinatesIndex = 1;
                            //         sceneLightmap.vScale = -1;
                            //         material.lightmapTexture = sceneLightmap;
                            //         material.useLightmapAsShadowmap=true;
                            //     } else {
                            //         var sceneLightmap = null;
                            //     }
                            
                            // }


                            
                            // Add a material to the mesh
                            //const material = new BABYLON.StandardMaterial("myMaterial", this.scene);
                            //mesh.material = material;

                            // Optionally set position, rotation, etc.
                            //mesh.position = new BABYLON.Vector3(0, 0, 0);
                        });
                    };
                    meshTask.onError = (task, message, exception) => {
                        console.error(`Failed to load ${task.name}: ${message}`, exception);
                    };
                    break;
                case 'texture':
                    const textureTask = this.assetsManager.addTextureTask(asset.name, asset.url);
                    textureTask.onSuccess = (task) => console.log(`${task.name} texture loaded`);
                    break;
                case 'audio':
                    // Audio files can be loaded with BinaryFileAssetTask if further processing is needed
                    const audioTask = this.assetsManager.addBinaryFileTask(asset.name, asset.url);
                    audioTask.onSuccess = (task) => console.log(`${task.name} audio loaded`);
                    break;
                case 'hdr':
                    const hdrTask = this.assetsManager.addCubeTextureTask(asset.name, asset.url);
                    hdrTask.onSuccess = (task) => console.log(`${task.name} HDR loaded`);
                    break;
                default:
                    console.warn(`Unsupported asset type: ${asset.type}`);
                    break;
            }
        });

        this.assetsManager.onFinish = (tasks) => {
            console.log("All assets loaded");
            // Additional code to run after all assets are loaded

            //How do I add add meshes to scene here?

        };

        this.assetsManager.load();
    }

}