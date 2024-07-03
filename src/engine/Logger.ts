import { NXUtility } from "./Utility";

export class NXLogger {

    private static entries: string[] = [];

    public static log(message: string, error: boolean = false) {

        if(error) {
            console.error(message);
        }
        else {
            console.log(message);
        }

        this.entries.push(NXUtility.getTimestamp(), message);
    }



}