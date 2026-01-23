import { check, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../core/validator';

export default class LoginRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            check('username')
                .exists({ checkFalsy: true })
                .withMessage('username is required')
                .bail()
                .isString()
                .withMessage('username should be string.'),

            check('password').exists({ checkFalsy: true }).withMessage('password is required'),
        ];

        return super.validation(req, res, next, validations);
    }
}
