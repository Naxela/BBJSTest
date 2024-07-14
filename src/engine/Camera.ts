import * as BABYLON from "@babylonjs/core";
import { NAXApp } from "../NAXApp";
import { NXUtility } from "./Utility";
import { NXLogger } from "./Logger";
export class NXCamera {



    constructor(){



    }

    public static setupCameras(scene, canvas) {

        //Create cameras
        this.activeCamera = new BABYLON.ArcRotateCamera("camera", Math.PI/3, Math.PI/3, 10, BABYLON.Vector3.Zero(), scene);

        // // This targets the camera to scene origin
        this.activeCamera.setTarget(BABYLON.Vector3.Zero());

        // // This attaches the camera to the canvas
        this.activeCamera.attachControl(canvas, true);

        // //Set scrolling speed
        this.activeCamera.wheelPrecision = 50.0;

    }



}