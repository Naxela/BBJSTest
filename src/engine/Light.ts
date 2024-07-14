import * as BABYLON from "@babylonjs/core";
import { NAXApp } from "../NAXApp";
import { NXUtility } from "./Utility";
import { NXLogger } from "./Logger";
export class NXLight {

    constructor(){

    }

    public static setupLights() {

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.babylonScene);

        // Default intensity is 1. Let's dim the light a small amount

    }



}