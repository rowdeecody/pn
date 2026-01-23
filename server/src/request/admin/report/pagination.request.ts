import { query, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../../core/validator';

export default class PaginationRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            query('limit').optional().isNumeric().withMessage('limit must be a number.'),

            query('offset').optional().isNumeric().withMessage('offset must be a number.'),
        ];

        return super.validation(req, res, next, validations);
    }
}
