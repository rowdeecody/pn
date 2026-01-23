import { PC_STATUS } from '../utils/enums/PcEnum';
import PC from '../models/PC';

declare global {
    namespace Express {
        interface Request {
            validated?: any;
            pc?: PC | null;
        }
    }
}
