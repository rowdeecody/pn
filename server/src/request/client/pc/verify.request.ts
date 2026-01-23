import { check, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../../core/validator';

export default class VerifyPcRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            check('mac_address')
                .exists({ checkFalsy: true })
                .withMessage('mac_address is required')
                .bail()
                .isMACAddress()
                .withMessage('mac_address should be a valid MAC address.'),
        ];

        return super.validation(req, res, next, validations);
    }
}
