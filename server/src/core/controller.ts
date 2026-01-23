import { Request } from './express';
import Logger from './logger';

export default class Controller {
    // Base controller methods can go here
    public static async log(req: Request, description: string) {
        // Optional: Implement logging logic here
        Logger.log().info(`Log: ${description}`);
    }
}
