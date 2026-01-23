import { check, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../../core/validator';

export default class RestoreBackupRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            check('backupPath')
                .exists({ checkFalsy: true })
                .withMessage('backupPath is required')
                .bail()
                .isString()
                .withMessage('backupPath should be string.'),
        ];

        return super.validation(req, res, next, validations);
    }
}
