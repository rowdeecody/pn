import { check, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../core/validator';

export default class CoinInsertRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            check('amount')
                .exists({ checkFalsy: true })
                .withMessage('amount is required')
                .bail()
                .isNumeric()
                .withMessage('amount must be a number.'),
        ];

        return super.validation(req, res, next, validations);
    }
}
