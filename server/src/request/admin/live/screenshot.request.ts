import { param, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../../core/validator';

export default class LiveScreenshotRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            param('pc_id').exists().isNumeric().withMessage('pc_id must be a number.'),
        ];

        return super.validation(req, res, next, validations);
    }
}
