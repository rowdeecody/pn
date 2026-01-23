import { check, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Validator from '../../../core/validator';
import PC from '../../../models/PC';

export default class RegisterPcRequest extends Validator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        const validations: ValidationChain[] = [
            check('name')
                .exists({ checkFalsy: true })
                .withMessage('name is required')
                .bail()
                .isString()
                .withMessage('name should be string.')
                .bail()
                .matches(/^[a-zA-Z0-9- ]+$/, 'i')
                .withMessage('name only allows alphanumeric, spaces, and hyphens.')
                .bail()
                .custom(async (name, { req }) => {
                    let pc = (req as any).pc;

                    if (pc && pc.name === name) {
                        return Promise.reject('name is already in use.');
                    } else {
                        pc = await PC.findOne({
                            where: {
                                name: name,
                            },
                        });
                        if (pc) {
                            return Promise.reject('name is already in use.');
                        }
                    }
                }),

            check('mac_address')
                .exists({ checkFalsy: true })
                .withMessage('mac_address is required')
                .bail()
                .isMACAddress()
                .withMessage('mac_address should be a valid MAC address.')
                .bail()
                .custom(async (mac_address, { req }) => {
                    let pc = (req as any).pc;

                    if (pc && pc.mac_address === mac_address) {
                        return Promise.reject('mac_address is already in use.');
                    } else {
                        pc = await PC.findOne({
                            where: {
                                mac_address: mac_address,
                            },
                        });
                        if (pc) {
                            return Promise.reject('mac_address is already in use.');
                        }
                    }
                }),

            check('ip_address')
                .exists({ checkFalsy: true })
                .withMessage('ip_address is required')
                .bail()
                .isIP()
                .withMessage('ip_address should be a valid IP address.')
                .bail()
                .custom(async (ip_address, { req }) => {
                    let pc = (req as any).pc;

                    if (pc && pc.ip_address === ip_address) {
                        return Promise.reject('ip_address is already in use.');
                    } else {
                        pc = await PC.findOne({
                            where: {
                                ip_address: ip_address,
                            },
                        });
                        if (pc) {
                            return Promise.reject('ip_address is already in use.');
                        }
                    }
                }),
        ];

        return super.validation(req, res, next, validations);
    }
}
