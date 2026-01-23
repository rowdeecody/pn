import { check, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../core/validator';

export default class CoinRejectedRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            check('amount')
                .exists({ checkFalsy: true })
                .withMessage('amount is required')
                .bail()
                .isNumeric()
                .withMessage('amount must be a number.'),

            check('reason')
                .exists({ checkFalsy: true })
                .withMessage('reason is required')
                .bail()
                .isString()
                .withMessage('reason should be string.'),
        ];

        return super.validation(req, res, next, validations);
    }
}
