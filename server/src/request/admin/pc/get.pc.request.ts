import { param, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../../core/validator';

export default class GetPcRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [param('id').exists().isNumeric().withMessage('id must be a number.')];

        return super.validation(req, res, next, validations);
    }
}
