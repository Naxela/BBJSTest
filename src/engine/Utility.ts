import { NXLogger } from "./Logger";

export class NXUtility {

    public static async loadJSON(url: string): Promise<any> {
        try {

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            
            return JSON.parse(text);

        } catch (error) {

            NXLogger.log(error, true);

            return "null";

        }
    }

    public static getTimestamp(): string {

        return "["+ Date.now() +"]";

    }

}