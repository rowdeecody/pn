import { check, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../../core/validator';

export default class UpdateSettingsRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            check('settings')
                .exists({ checkFalsy: true })
                .withMessage('settings is required')
                .bail()
                .isArray()
                .withMessage('settings should be an array.'),
        ];

        return super.validation(req, res, next, validations);
    }
}
