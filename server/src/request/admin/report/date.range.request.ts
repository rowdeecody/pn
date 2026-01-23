import { query, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../../core/validator';

export default class DateRangeRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            query('start_date')
                .exists({ checkFalsy: true })
                .withMessage('start_date is required')
                .bail()
                .isISO8601()
                .withMessage('start_date must be a valid date format.'),

            query('end_date')
                .exists({ checkFalsy: true })
                .withMessage('end_date is required')
                .bail()
                .isISO8601()
                .withMessage('end_date must be a valid date format.'),
        ];

        return super.validation(req, res, next, validations);
    }
}
