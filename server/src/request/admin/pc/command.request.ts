import { check, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../../core/validator';

export default class CommandRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            check('command')
                .exists({ checkFalsy: true })
                .withMessage('command is required')
                .bail()
                .isIn(['lock', 'unlock', 'add_time', 'reset_time', 'shutdown', 'restart'])
                .withMessage('invalid command.'),

            check('payload').optional().isObject().withMessage('payload should be an object.'),
        ];

        return super.validation(req, res, next, validations);
    }
}
