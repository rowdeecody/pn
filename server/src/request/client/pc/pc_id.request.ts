import { check, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../../core/validator';

export default class PcIdRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            check('pc_id')
                .exists({ checkFalsy: true })
                .withMessage('pc_id is required')
                .bail()
                .isNumeric()
                .withMessage('pc_id must be a number.'),
        ];

        return super.validation(req, res, next, validations);
    }
}
